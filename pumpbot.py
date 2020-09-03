from nltk.sentiment.vader import SentimentIntensityAnalyzer
import praw
import getopt
import sys
import string
import os
from textblob import TextBlob
# VADER can be accessed by the NLTK library.
import nltk
# Download the VADAR tool and access it through the NLTK library.
# nltk.download('vader_lexicon')

# Import company dictionaries
from company_dicts.NASDAQ_formatted import nasdaq
from company_dicts.NYSE_formatted import nyse
from company_dicts.TSX_formatted import tsx
from company_dicts.TSXV_formatted import tsxv
from company_dicts.CSE_formatted import cse

sia = SentimentIntensityAnalyzer()

reddit = praw.Reddit("pumpBot")
reddit.read_only = True

common_word_file = open(
    '/home/jeffk/pumpBot/company_dicts/common.txt', 'a')
common_words = set(line.strip() for line in open(
    '/home/jeffk/pumpBot/company_dicts/common.txt'))


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

# Sentiment analysis of replies


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


def create_post(exchange, comment, word, company):
    post = {
        "company": company,
        "keyword": word,
        "exchange": exchange,
        "comment": comment,
        "commentScore": comment.score,
        "poster": comment.author,
        "datePosted": comment.created_utc,
        "subreddit": comment.subreddit,
        "thread": comment.submission,
        "textblobSentiment": "",
        "vaderSentiment": "",
        "textblobPositiveReplies": "",
        "textblobNegativeReplies": "",
        "textblobNeutralReplies": "",
        "vaderPostiveReplies": "",
        "vaderNegativeReplies": "",
        "vaderNeutralReplies": "",
        "multiCompanyPost": "",
        "userAccountCreationDate": comment.author.created_utc,
    }
    post["textblobSentiment"] = text_blob_sentiment_top_level(comment.body)
    post["vaderSentiment"] = nltk_sentiment_top_level(comment.body)
    print(post)
    return True, post

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
                print('-' * count_comment, comment.body)
                text_blob_sentiment_replies(comment.body,
                                            sub_entries_textblob)
                nltk_sentiment_replies(comment.body, sub_entries_nltk)
            except:
                continue
            # Recursively call replies_of on any sub-comments of sub-comments,
            # getting sentiments of the entire comment tree
            replies_of(comment,
                       count_comment,
                       sub_entries_textblob,
                       sub_entries_nltk)


def get_comments():
    # Get list of already parsed comment IDs to avoid parsing comments more than once
    f = open('comment_ids.txt', 'a')
    parsed_comments = set(line.strip() for line in open('comment_ids.txt'))
    # Get comments from specified subreddits
    for count, comment in enumerate(reddit.subreddit('weedstocks').comments()):
        print(count)
        # If true comment is top level comment in thread
        print("comment parent id: " + comment.parent_id)
        print("comment submission id: " + comment.submission.id)
        if comment.parent_id[0:3] == 't3_':
            if comment.id not in parsed_comments:
                # Add comment id to parsed comments so it is not counted multiple times
                parsed_comments.add(comment.id)
                f.write("\n" + comment.id)
                print("----- COMMENT -----")
                print(comment.body)
                post_created = False
                comment_body = comment.body.translate(
                    str.maketrans('', '', string.punctuation)).lower().split()
                for word in comment_body:
                    if word not in common_words:
                        if word in nasdaq:
                            print("\tnasdaq: " + word)
                            post_created, post = create_post(
                                "nasdaq", comment, word, nasdaq[word])
                        elif word in nyse:
                            print("\tnyse: " + word)
                            post_created, post = create_post(
                                "nyse", comment, word, nyse[word])
                        elif word in tsx:
                            print("\ttsx: " + word)
                            post_created, post = create_post(
                                "tsx", comment, word, tsx[word])
                        elif word in tsxv:
                            print("\ttsxv: " + word)
                            post_created, post = create_post(
                                "tsxv", comment, word, tsxv[word])
                        elif word in cse:
                            print("\tcse: " + word)
                            post_created, post = create_post(
                                "cse", comment, word, cse[word])
                # Iterate through every word of the comment and see if they are in the company dicts
                if post_created:
                    sub_entries_textblob = {
                        'negative': 0, 'positive': 0, 'neutral': 0}
                    sub_entries_nltk = {'negative': 0,
                                        'positive': 0, 'neutral': 0}
                    replies_of(comment, 0, sub_entries_textblob, sub_entries_nltk)
                    # print(post)
                    print(sub_entries_nltk)
                    print(sub_entries_textblob)


def train_words_helper(exchange, word):
    if word not in common_words:
        print(exchange + ": " + word)
        confirmation = input("Remove word? y/n: ")
        if confirmation == "y":
            common_words.add(word)
            common_word_file.write("\n" + word)
    else:
        pass


def train_words():
    f = open('comment_ids.txt', 'a')

    parsed_comments = set(line.strip() for line in open('comment_ids.txt'))
    for comment in reddit.subreddit('weedstocks').comments(limit=100):
        if comment.id not in parsed_comments:
            comment_body = comment.body.translate(
                str.maketrans('', '', string.punctuation)).lower().split()
            print("----- COMMENT -----")
            print(comment.body)
            for word in comment_body:
                if word in nasdaq:
                    train_words_helper("nasdaq", word)
                elif word in nyse:
                    train_words_helper("nyse", word)
                elif word in tsx:
                    train_words_helper("tsx", word)
                elif word in tsxv:
                    train_words_helper("tsxv", word)
                elif word in cse:
                    train_words_helper("cse", word)
    sys.exit(2)


def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "t", ["train"])
    except getopt.GetoptError as err:
        print(err)
        sys.exit(2)
    for o, a in opts:
        if o in ("-t", "--train"):
            train_words()
    get_comments()


if __name__ == '__main__':
    main()
