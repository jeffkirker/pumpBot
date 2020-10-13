# pumpBot

This is an application developed using the MEAN stack (Mongodb, ExpressJS, AngularJS, NodeJs), as well as various data scraping scripts written in python.

The goal of this application is to allow a user to search for a publicly traded company, and find a chart of daily, weekly, monthly, etc. mentions of said company on major stock trading subreddits. This data is then graphed with the actual stock price overlayed, allowing the user to see any visual trends/correlations between the amount a stock is being talked about, and the price of said stock.

Additionally, all comments mentioning a company are put through sentiment analysis using both the Vader and TextBlob natural language processing libraries. Sentiment analysis adds an additional metric to compare, allowing users to sort mentions by positive, neutral, or negative.

All reddit data is scraped using a combination of pushshift.io and reddit's API. Finance data is scraped from yahoo finance and allows for updates on the daily chart every 15min.

This project is a work in progress.

## Disclaimer

This app is for informational and entertainment use only. Any apparent correlations between the volume of mentions of a company, or sentiment related to company mentions, and subsequent share price increases/decreases is purely coincidental. Do not use easily manipulated reddit metrics to make stock trading decisions. 