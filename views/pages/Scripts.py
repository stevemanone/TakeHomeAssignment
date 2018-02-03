import re
from collections import defaultdict
import operator

filename='2014-09-03.log'

with open(filename,'rt') as f:
    averageTime = 0
    count = 0
    dbDict = defaultdict(int)
    URLsNotFound = defaultdict(int)

    for line in f:
        # Question 1
        if "status=404" in line:
            match = re.findall('path=\"?(.+?)\"?\s', line)
            URLsNotFound[match[0]]+= 1

        # Question 2
        if ("status=200" in line) and ("method=GET" in line):
            match = re.findall('([0-9]+\.?[0-9]{0,2})ms',line)
            totalTime = sum(map(float, match))
            averageTime += totalTime
            count += 1

        # Question 2
        match = re.findall('"([A-Za-z\.\_\-]+?)"(?:\.?"?[A-Za-z\.\_\-]+"?)?',line)
        for item in set(match):
            dbDict[item] += 1


    sorted_x = sorted(dbDict.items(), key=operator.itemgetter(1), reverse=True);

    #Print out answers
    print("Most popular database: ", sorted_x[0])
    print("Urls not found: ", URLsNotFound)

    averagePageTime = averageTime/count
    print("Average time to serve a page (in ms): ", averagePageTime)
