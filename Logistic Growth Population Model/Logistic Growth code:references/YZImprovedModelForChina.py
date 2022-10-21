import numpy as np
e = np.exp(1)
import matplotlib.pyplot as plt

import csv

with open('China.csv') as csv_file:
    csv_reader = list(csv.reader(csv_file, delimiter=','))
    
yearData = np.arange(0,len(csv_reader),1)
populationData = np.arange(0,len(csv_reader),1)*1.0

n = 0
while n < len(csv_reader):
    yearData[n] = csv_reader[n][0]
    populationData[n] = csv_reader[n][1]
    n += 1

firstYear = yearData[0]
yearData = yearData - firstYear
firstYearPopulationData = populationData[0]
populationData = populationData/firstYearPopulationData
populationModel = populationData*0
populationModel[0] = populationData[0]
plt.subplot(121)
plt.plot(yearData, populationData, "o",markersize=3)
plt.subplot(122)
plt.plot(yearData, populationData, "o",markersize=3)

guessRLow = 0.01
guessRHigh = 0.05
guessKLow = np.max(populationData)
guessKHigh = 2*guessKLow
guessALow = 0.95
guessAHigh = 1.05


minimumDistanceSquare = 1e6
fineFactor = 10
fineYearData = np.arange(0, yearData[len(yearData)-1]+1,1/fineFactor)
finePopulationModel = fineYearData*0.0
finePopulationModel[0] = populationData[0]


h = fineYearData[1] - fineYearData[0]
guessGHigh = 0.98
guessGLow = 0.95
guessG = guessGLow
while guessG < guessGHigh:
    print("guessG: ", guessG)
    finePopulationModel[0] = guessG*populationData[0]
    guessK = guessKLow
    while guessK < guessKHigh:
        print("guessK: ", guessK)
        guessR = guessRLow
        while guessR < guessRHigh:
            guessA = guessALow
            while guessA < guessAHigh:
                n = 0
                while n < len(finePopulationModel)-1:
                    finePopulationModel[n+1] = finePopulationModel[n]+h*guessR*finePopulationModel[n]*(1-(finePopulationModel[n])/guessK)**guessA
                    n += 1
                n = 0
                while n < len(populationModel):
                    populationModel[n] = finePopulationModel[n*fineFactor]
                    n += 1


                squareDistance = 0
                n = 0
                while n < len(yearData):
                    squareDistance += (populationData[n]-populationModel[n])**2
                    n += 1
                if squareDistance < minimumDistanceSquare:
                    minimumDistanceSquare = squareDistance
                    hitG = guessG
                    hitK = guessK
                    hitR = guessR
                    hitA = guessA
                    #print(" tentative hitK= ", hitK, "hitR= " ,hitR, "hitA= ", hitA, "min= " ,minimumDistanceSquare)
                guessA += 0.01
            guessR += 0.001
        guessK += 0.1
    guessG += 0.01
print("hitG = ", hitG, "hitK= ", hitK, "hitR= " ,hitR, "hitA= ", hitA, "minRMSE = " ,np.sqrt(minimumDistanceSquare/len(yearData)))
yearExtendPositive = np.arange(0,200,1/fineFactor)
populationModelExtendPositive = yearExtendPositive*0.0
populationModelExtendPositive[0] = hitG*populationData[0]
n = 0  
while n < len(populationModelExtendPositive)-1:
    populationModelExtendPositive[n+1] = populationModelExtendPositive[n]+h*hitR*populationModelExtendPositive[n]*(1-(populationModelExtendPositive[n])/hitK)**hitA
    n += 1
yearExtendNegative = np.arange(0,-200,-1/fineFactor)
populationModelExtendNegative = yearExtendNegative*0.0
populationModelExtendNegative[0] = hitG*populationData[0]
n = 0  
while n < len(populationModelExtendNegative)-1:
    populationModelExtendNegative[n+1] = populationModelExtendNegative[n]-h*hitR*populationModelExtendNegative[n]*(1-(populationModelExtendNegative[n])/hitK)**hitA
    n += 1

plt.subplot(121)
plt.suptitle("YaoZheng's Model:", fontsize=14, fontweight='bold')
plt.plot(yearExtendPositive, populationModelExtendPositive, 'g', linewidth=0.5)
plt.plot(yearExtendNegative, populationModelExtendNegative, 'g', linewidth=0.5)
plt.title('China Population')
plt.ylabel("Popultion (normalized to 1960's)")
plt.xlabel("Year (offset to 1960)")
plt.grid()
plt.subplot(122)
plt.plot(yearExtendPositive, populationModelExtendPositive, 'g', linewidth=0.5)
plt.plot(yearExtendNegative, populationModelExtendNegative, 'g', linewidth=0.5)
plt.grid()
plt.axis([-10,70,0.9,2.3])
plt.title('China Population (Zoom-In)')
plt.ylabel("Popultion (normalized to 1960's)")
plt.xlabel("Year (offset to 1960)")
plt.show()




