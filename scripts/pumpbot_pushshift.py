import requests
import getopt
import sys
import json
import time
import string
from datetime import datetime
import pymongo
from pymongo import MongoClient

from textblob import TextBlob
# VADER can be accessed by the NLTK library.
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Import company dictionaries
from company_dicts.NASDAQ_formatted import nasdaq
from company_dicts.NYSE_formatted import nyse
from company_dicts.TSX_formatted import tsx
from company_dicts.TSXV_formatted import tsxv
from company_dicts.CSE_formatted import cse
from company_dicts.OTC_formatted import otc

common_word_file = open(
    '/home/jeffk/pumpBot/company_dicts/common.txt', 'a')
common_words = set(line.strip() for line in open(
    '/home/jeffk/pumpBot/company_dicts/common.txt'))

confirmed_word_file = open(
    '/home/jeffk/pumpBot/company_dicts/confirmed.txt', 'a')
confirmed_words = set(line.strip() for line in open(
    '/home/jeffk/pumpBot/company_dicts/confirmed.txt'))

url = "https://api.pushshift.io/reddit/search/comment/"

sia = SentimentIntensityAnalyzer()

client = MongoClient()


def text_blob_sentiment_top_level(comment):
    analysis = TextBlob(comment)
    if analysis.sentiment.polarity >= 0.0001:
        if analysis.sentiment.polarity > 0:
            return 'Positive'
    elif analysis.sentiment.polarity <= -0.0001:
        if analysis.sentiment.polarity <= 0:
            return 'Negative'
    else:
        return 'Neutral'


def nltk_sentiment_top_level(comment):
    vs = sia.polarity_scores(comment)
    if not vs['neg'] > 0.05:
        if vs['pos'] - vs['neg'] > 0:
            return 'Positive'
        else:
            return 'Neutral'
    elif not vs['pos'] > 0.05:
        if vs['pos'] - vs['neg'] <= 0:
            return 'Negative'
        else:
            return 'Neutral'
    else:
        return 'Neutral'


def text_blob_sentiment_replies(comment, sub_entries_textblob):
    analysis = TextBlob(comment)
    if analysis.sentiment.polarity >= 0.0001:
        if analysis.sentiment.polarity > 0:
            sub_entries_textblob['positive'] = sub_entries_textblob['positive']+1
            return 'Positive'
    elif analysis.sentiment.polarity <= -0.0001:
        if analysis.sentiment.polarity <= 0:
            sub_entries_textblob['negative'] = sub_entries_textblob['negative'] + 1
            return 'Negative'
    else:
        sub_entries_textblob['neutral'] = sub_entries_textblob['neutral'] + 1
        return 'Neutral'


def nltk_sentiment_replies(comment, sub_entries_nltk):
    vs = sia.polarity_scores(comment)
    if not vs['neg'] > 0.05:
        if vs['pos'] - vs['neg'] > 0:
            sub_entries_nltk['positive'] = sub_entries_nltk['positive'] + 1
            return 'Positive'
        else:
            sub_entries_nltk['neutral'] = sub_entries_nltk['neutral'] + 1
            return 'Neutral'

    elif not vs['pos'] > 0.05:
        if vs['pos'] - vs['neg'] <= 0:
            sub_entries_nltk['negative'] = sub_entries_nltk['negative'] + 1
            return 'Negative'
        else:
            sub_entries_nltk['neutral'] = sub_entries_nltk['neutral'] + 1
            return 'Neutral'
    else:
        sub_entries_nltk['neutral'] = sub_entries_nltk['neutral'] + 1
        return 'Neutral'

# Recursive function to get sentiments of sub-comments


def replies_of(top_level_comment,
               count_comment,
               sub_entries_textblob,
               sub_entries_nltk):
    if len(top_level_comment.replies) == 0:
        count_comment = 0
        return
    else:
        for num, comment in enumerate(top_level_comment.replies):
            try:
                count_comment += 1
                # print('-' * count_comment, comment.body)
                text_blob_sentiment_replies(comment["body"],
                                            sub_entries_textblob)
                nltk_sentiment_replies(comment["body"], sub_entries_nltk)
            except:
                continue
            # Recursively call replies_of on any sub-comments of sub-comments,
            # getting sentiments of the entire comment tree
            replies_of(comment,
                       count_comment,
                       sub_entries_textblob,
                       sub_entries_nltk)


def create_post(exchange, comment, word, company):
    post = {
        "company": company,
        "keyword": word,
        "exchange": exchange,
        "commentID": comment["id"],
        "commentScore": comment["score"],
        "poster": comment["author"],
        "datePosted": comment["created_utc"],
        "subreddit": comment["subreddit"],
        "thread": comment["permalink"],
        "textblobSentiment": "",
        "vaderSentiment": "",
        "textblobPositiveReplies": 0,
        "textblobNegativeReplies": 0,
        "textblobNeutralReplies": 0,
        "vaderPostiveReplies": 0,
        "vaderNegativeReplies": 0,
        "vaderNeutralReplies": 0,
        "multiCompanyPost": "",
        # "userAccountCreationDate": ""
    }
    # try:
    #     post["userAccountCreationDate"] = comment.author.created_utc
    # except:
    #     pass
    post["textblobSentiment"] = text_blob_sentiment_top_level(comment["body"])
    post["vaderSentiment"] = nltk_sentiment_top_level(comment["body"])

    # Each subreddit has its own database
    db = client[post["subreddit"]]
    company_name = post["company"]
    # Each company has its own collection
    company_collection = db[company_name]
    # sub_entries_textblob = {
    #     'negative': 0, 'positive': 0, 'neutral': 0}
    # sub_entries_nltk = {'negative': 0,
    #                     'positive': 0, 'neutral': 0}
    # replies_of(comment, 0, sub_entries_textblob,
    #            sub_entries_nltk)
    # post["textblobPositiveReplies"] = sub_entries_textblob["positive"]
    # post["textblobNegativeReplies"] = sub_entries_textblob["negative"]
    # post["textblobNeutralReplies"] = sub_entries_textblob["neutral"]
    # post["vaderPostiveReplies"] = sub_entries_nltk["positive"]
    # post["vaderNegativeReplies"] = sub_entries_nltk["negative"]
    # post["vaderNeutralReplies"] = sub_entries_nltk["neutral"]
    company_collection.insert_one(post)
    print(post["commentID"])


def process_comments(json_comments):
    # Get list of already parsed comment IDs to avoid parsing comments more than once
    f = open('comment_ids.txt', 'a')
    parsed_comments = set(line.strip() for line in open('comment_ids.txt'))

    for count, comment in enumerate(json_comments["data"]):
        if comment["id"] not in parsed_comments:
            # Add comment id to parsed comments so it is not counted multiple times
            parsed_comments.add(comment["id"])
            f.write("\n" + comment["id"])
            post_created = False
            comment_body = comment["body"].translate(
                str.maketrans('', '', string.punctuation)).lower().split()

            # Iterate through every word of the comment and see if they are in the company dicts
            for word in comment_body:
                if word not in common_words:
                    if word in nasdaq:
                        print("\tnasdaq: " + word)
                        create_post(
                            "nasdaq", comment, word, nasdaq[word])
                    if word in nyse:
                        print("\tnyse: " + word)
                        create_post(
                            "nyse", comment, word, nyse[word])
                    if word in tsx:
                        print("\ttsx: " + word)
                        create_post(
                            "tsx", comment, word, tsx[word])
                    if word in tsxv:
                        print("\ttsxv: " + word)
                        create_post(
                            "tsxv", comment, word, tsxv[word])
                    if word in cse:
                        print("\tcse: " + word)
                        create_post(
                            "cse", comment, word, cse[word])
                    if word in otc:
                        print("\totc: " + word)
                        create_post(
                            "otc", comment, word, otc[word])
        else:
            return False

    return True


def get_comment_history(subreddit_name):
    now = datetime.today()
    now_utc_seconds = int(now.timestamp())
    current = now_utc_seconds
    with open('last_post_' + subreddit_name + ".txt", 'r') as last_post_file:
        last_post = last_post_file.readline()
    print(last_post)

    while current > int(last_post):
        print(current)
        # Apparently comment api rates limit response to 100 comments returned max.
        response = requests.get(url + "?subreddit=" +
                                subreddit_name + "&size=100" + "&before=" + str(current))
        # with open('test.json', 'w') as file:
        #     file.write(json.dumps(response.json()))

        # update current value to earliest time in response
        current = response.json()["data"][-1]["created_utc"]

        # Send data to be processed
        if process_comments(response.json()) == False:
            sys.exit(0)

    with open('last_post.txt', 'w') as last_post_file:
        last_post_file.write(str(now_utc_seconds))
    print("Finished collecting posts from " + subreddit_name)
    print("Previously up to date from: " + current)
    print("Now up to date from: " + now_utc_seconds)


def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "s:", ["subreddit"])
    except getopt.GetoptError as err:
        print(err)
        sys.exit(2)

    for o, a in opts:
        if o in ("-s", "--subreddit"):
            if a in ("wsb", "wallstreetbets"):
                get_comment_history("wallstreetbets")
            elif a in ("investing"):
                get_comment_history("investing")
            elif a in ("stocks"):
                get_comment_history("stocks")
            elif a in ("weedstocks"):
                get_comment_history("weedstocks")
            elif a in ("pennystocks"):
                get_comment_history("pennystocks")


if __name__ == '__main__':
    main()
