import os, pprint
import pymongo
from bson.objectid import ObjectId

def storeMap(mapObj):
    dbClient = pymongo.MongoClient( os.environ['MGDB_MAP_URI'] )
    map_col = dbClient['snake_irl']['maps']
    map_col.insert_one( mapObj )

def createMap():
    title = input("Map title: ")
    description = input("Map description: ")
    points = []
    print("Enter points of interest")
    while True:
        p_name = input("Point name: ")

        if p_name == "stop": break

        p_coords = input("Point coordinates: ")
        p_coords = p_coords.split(',')
        try:
            p_lat = float(p_coords[0].strip())
            p_long = float(p_coords[1].strip())

            points.append({"name": p_name, "lat": p_lat, "long": p_long})
        except:
            pass

    mapObj = {
            "title": title,
            "description": description,
            "mapOwner": ObjectId('6074c5457fbd0d59951b44d0'),
            "top": None,
            "pointsOfInterest": points
            }
    pprint.pprint(mapObj)

    storeMap(mapObj)

if __name__ == "__main__":
    createMap()
