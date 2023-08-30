from jqdatasdk import *
from datetime import datetime
import pandas as pd
import math
import numpy
import matplotlib.pyplot as plt

file_path = '/Users/troythetre/Downloads/optionPairs.xlsx'
optionPairs = pd.read_excel(file_path)
print(optionPairs)


stockNumber = "510050.XSHG" #S
tradingNumberOne = "10004683.XSHG"
JQdataAC='11111100051'
JQdataPW='5Cgn3v6Y' 
n = 100
is_auth = is_auth()
auth(JQdataAC,JQdataPW)
underLyingSymbol = "510050.XSHG" #S
priceInfo=get_bars(underLyingSymbol, 20, unit='1d',include_now=True, end_dt=None, fq_ref_date=None,df=True)
print(priceInfo)

df = pd.DataFrame() #new dataframe table
df['Date'] = priceInfo['date']
df['Price'] = priceInfo['open']
r = 0.028
#print(df)

for x in optionPairs.columns:
    df[x] = optionPairs[x]

#timestamp = pd.Timestamp("2023-08-04 12:34:56")

for m in range(29,71):
    for i in range(1,len(df.index)):
        date1 = df.at[0, 'exercise_date_' + str(m)]
        timestamp1 = pd.Timestamp(date1)
        datetime_object1 = pd.to_datetime(timestamp1)
        print(i)
        print(date1)
        date2 = df.at[i, 'Date']
        timestamp2 = pd.Timestamp(date2)
        datetime_object2 = pd.to_datetime(timestamp2)
        date_string1 = datetime_object1.strftime("%Y-%m-%d %H:%M:%S")
        date_string2 = datetime_object2.strftime("%Y-%m-%d %H:%M:%S")
        datetime_obj1 = datetime.strptime(date_string1, "%Y-%m-%d %H:%M:%S")
        datetime_obj2 = datetime.strptime(date_string2, "%Y-%m-%d %H:%M:%S")

        time_difference = datetime_obj1 - datetime_obj2
        date_difference_in_days = time_difference.days  

        df.at[i,'exercise_date_' + str(m)] = date_difference_in_days

        df.at[i,'bV_' + str(m)] = df.at[0,'CO_listPrice_' + str(m)] + df.at[0,'exercise_price_' + str(m)] * math.e**(-0.028/365*df.at[i, 'exercise_date_' + str(m)]) - df.at[0,'PO_listPrice_' + str(m)] - df.at[i,'Price']


print(df)
print(df['bV_29'])
print(df['bV_70'])

maxBvValue = 0
maxNumber = 0
for n in range(29,71):
    bvValue = numpy.max(df['bV_'+str(n)])
    if bvValue > maxNumber:
        maxBvValue = bvValue
        maxNumber = n

print(maxBvValue)
print(maxNumber)

plt.plot(df['bV_'+str(maxNumber)])
plt.show()
    


excel_filename = 'optionTry.xlsx'  # Change this to your desired filename
sheet_name = 'Sheet1'  # Change this to your desired sheet name

df.to_excel(excel_filename, index=False, sheet_name=sheet_name)

"""
for i in range(1,len(df.index)):
    df.at[i,'bV_29'] = df.at[0,'CO_listPrice_29'] + df.at[0,'exercise_price_29'] * math.e**(-0.028/365*df.at[i, 'exercise_date_29']) - df.at[0,'PO_listPrice_70'] - df.at[i,'Price']

print(df['bV_29'])
"""
"""
date1 = df.at[0,'exercise_date_29']
print(date1)
input("a")
timestamp1 = pd.Timestamp(date1)
datetime_object1 = pd.to_datetime(timestamp1)
print(datetime_object1)
input("x")

date2 = df.at[1,'Date']
timestamp2 = pd.Timestamp(date2)
datetime_object2 = pd.to_datetime(timestamp2)

print(datetime_object1, datetime_object2)

date_string1 = datetime_object1.strftime("%Y-%m-%d %H:%M:%S")
date_string2 = datetime_object2.strftime("%Y-%m-%d %H:%M:%S")

datetime_obj1 = datetime.strptime(date_string1, "%Y-%m-%d %H:%M:%S")
datetime_obj2 = datetime.strptime(date_string2, "%Y-%m-%d %H:%M:%S")

time_difference = datetime_obj1 - datetime_obj2
date_difference_in_days = time_difference.days

print(date_difference_in_days)
"""









