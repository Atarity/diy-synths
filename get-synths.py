import os, operator
from functools import reduce
from pyairtable import Api

api_token = os.environ["AIRTABLE_SYNTHSDB_TOKEN"]
base_id = os.environ["AIRTABLE_BASE_ID"]
table_name = "Table 1"
file1 = "README.md"
content = """## [SORTABLE LIST](https://diy-synths.snnkv.com/)  /  [SUBMIT DESIGN](https://diy-synths.snnkv.com/submit)  /  [DISCUSSION](https://github.com/Atarity/diy-synths/discussions)\n
This is a list of synthesizers and related hardware you can build
on your own. All designs are open-source including firmware.
[Submit designs](https://diy-synths.snnkv.com/submit) which is not
in list and [discuss](https://github.com/Atarity/diy-synths/discussions)
your building experience.\n
![DIY-synths-title](/diy-synths-title.jpg)\n"""

api = Api(api_token)
table = api.table(base_id, table_name)
# print(table.all())
data = table.all()
data.sort(key=lambda e: e["fields"]["Name"], reverse=False) # sort list of dicts by name A-Z

def getFromDict(dataDict, mapList):
    return reduce(operator.getitem, mapList, dataDict)

for f in range (0, len(data)):
    try:
        name = str(getFromDict(data[f], ["fields", "Name"]))
        #print(name)
        url = str(getFromDict(data[f], ["fields", "Docs"]))
        desc = str(getFromDict(data[f], ["fields", "Description"]))
        content +=  "1. [" + name + "](" + url + ")" + " — " + desc
    except:
        content += "- MISSED" + "\n"
        print("---MISSED")

with open(file1, "w") as file:
    file.write(content)