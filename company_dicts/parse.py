import json

from varname import nameof


def parse(filename, f, exchange):
    tickers = {}
    common_words = set(line.strip() for line in open('common.txt'))
    f.write(exchange + " = ")
    with open(filename) as fh:
        for line in fh:
            ticker, description = line.strip().split(None, 1)
            ticker = ticker.lower()
            description = description.lower()
            derivative_check = ticker.split(".")
            if len(derivative_check) > 1:
                tickers[ticker] = derivative_check[0]
            else:
                # Multiple dictionary entries for each company, where the value is always the unique ticker
                if ticker not in common_words:
                    tickers[ticker] = ticker
                tickers[description.strip()] = ticker
                split_description = description.strip().split(' ')
                try:
                    if split_description[0] not in common_words:
                        tickers[split_description[0]] = ticker
                except:
                    pass
                try:
                    tickers[split_description[0] + " " +
                            split_description[1]] = ticker
                except:
                    pass
                try:
                    tickers[split_description[0] + " " +
                            split_description[1] + " " + split_description[2]] = ticker
                except:
                    pass
                try:
                    tickers[split_description[0] + " " + split_description[1] +
                            " " + split_description[2] + " " + split_description[3]] = ticker
                except:
                    pass
                try:
                    tickers[split_description[0] + " " + split_description[1] + " " +
                            split_description[2] + " " + split_description[3] + " " + split_description[4]] = ticker
                except:
                    pass

    f.write(json.dumps(tickers, indent=2, sort_keys=True))


nasdaq = 'NASDAQ.txt'
open('NASDAQ_formatted.py', 'w').close()
nasdaq_formatted = open('NASDAQ_formatted.py', 'a')

nyse = 'NYSE.txt'
open('NYSE_formatted.py', 'w').close()
nyse_formatted = open('NYSE_formatted.py', 'a')

tsx = 'TSX.txt'
open('TSX_formatted.py', 'w').close()
tsx_formatted = open('TSX_formatted.py', 'a')

tsxv = 'TSXV.txt'
open('TSXV_formatted.py', 'w').close()
tsxv_formatted = open('TSXV_formatted.py', 'a')

cse = 'CSE.txt'
open('CSE_formatted.py', 'w').close()
cse_formatted = open('CSE_formatted.py', 'a')

parse(nasdaq, nasdaq_formatted, "nasdaq")
parse(nyse, nyse_formatted, "nyse")
parse(tsx, tsx_formatted, "tsx")
parse(tsxv, tsxv_formatted, "tsxv")
parse(cse, cse_formatted, "cse")
