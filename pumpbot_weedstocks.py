from nltk.sentiment.vader import SentimentIntensityAnalyzer
import praw
from textblob import TextBlob
# VADER can be accessed by the NLTK library.
import nltk
# Download the VADAR tool and access it through the NLTK library.
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()

reddit = praw.Reddit("pumpBot")
reddit.read_only = True

threads = reddit.subreddit('weedstocks').top('week', limit=1)


def text_blob_sentiment(review, sub_entries_textblob):
    analysis = TextBlob(review)
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

# sentiment analysis function for VADER tool


def nltk_sentiment(review, sub_entries_nltk):
    vs = sia.polarity_scores(review)
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
                print('-' * count_comment, comment.body)
                text_blob_sentiment(comment.body,
                                    sub_entries_textblob)
                nltk_sentiment(comment.body, sub_entries_nltk)
            except:
                continue
            # Recursively call replies_of on any sub-comments of sub-comments,
            # getting sentiments of the entire comment tree
            replies_of(comment,
                       count_comment,
                       sub_entries_textblob,
                       sub_entries_nltk)


def main():
    for submission in threads:
        sub_entries_textblob = {'negative': 0, 'positive': 0, 'neutral': 0}
        sub_entries_nltk = {'negative': 0, 'positive': 0, 'neutral': 0}
        print('Title of the post :', submission.title)
        # Check sentiment of thread title first
        text_blob_sentiment(submission.title, sub_entries_textblob)
        nltk_sentiment(submission.title, sub_entries_nltk)
        print("\n")
        submission_comm = reddit.submission(id=submission.id)

        for count, top_level_comment in enumerate(submission_comm.comments):
            print(
                f"-------------{count} top level comment start--------------")
            count_comm = 0
            try:
                print(top_level_comment.body)
                # Get sentiments of top level comment
                text_blob_sentiment(top_level_comment.body,
                                    sub_entries_textblob)
                nltk_sentiment(top_level_comment.body, sub_entries_nltk)
                # Get sentiments of sub comments
                replies_of(top_level_comment,
                           count_comm,
                           sub_entries_textblob,
                           sub_entries_nltk)
            except:
                continue
        print('Over all Sentiment of Topic by TextBlob :', sub_entries_textblob)
        print('Over all Sentiment of Topic by VADER :', sub_entries_nltk)
        print("\n\n\n")


if __name__ == '__main__':
    main()
