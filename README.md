# wheels-of-fortune
Wheels of fortune experiment code

Note that a new javascript trial list can be created in R using the following code and selecting a csv file with the same headings as the trialList file:
write(c("var trial_list =", jsonlite::toJSON(read.csv(file.choose()))), file = "trial_list.js")
