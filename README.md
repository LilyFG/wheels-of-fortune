# wheels-of-fortune
Wheels of fortune experiment code

Note that a new javascript trial list can be created in R using the following code and selecting a csv file with the same headings as the trialList file:

install.packages("jsonlite")  
library(jsonlite)  
write(c("var trial_list =", toJSON(read.csv(file.choose()))), file = "trial_list.js")
