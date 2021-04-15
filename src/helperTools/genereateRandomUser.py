import json, os, random, pprint
import pymongo, requests

randomUserKey = os.environ['RANDOM_USER_API_KEY']

def fetchAPI():
    resp = requests.get('https://randomuser.me/api/?nat=us')
    resp = resp.json()
    return resp

def generateUser():
    randomUser = fetchAPI()

    retObj = {}
    retObj['username'] = randomUser['results'][0]['login']['username']
    retObj['history'] = []
    retObj['points'] = random.random() * 10000
    retObj['totalPlaytime'] = random.random() * 100
    retObj['lastLogin'] = randomUser['results'][0]['registered']['date']
    retObj['demographics'] = {"age": randomUser['results'][0]['dob']['age'], "homebase": {"lat": randomUser['results'][0]['location']['coordinates']['latitude'], "long": randomUser['results'][0]['location']['coordinates']['longitude']}}
    retObj['socialMedia'] = []
    retObj['maps'] = {"favoriteMaps": [], "createdMaps": []}

    return retObj

def pushUserToMongo( userObj ):
    dbClient = pymongo.MongoClient( os.environ['MGDB_PLAYER_URI'] )

    player_accounts_col = dbClient['snake_irl']['player_accounts']

    player_accounts_col.insert_one( userObj )

def pushUsersToMongo( userObjs ):
    dbClient = pymongo.MongoClient( os.environ['MGDB_PLAYER_URI'] )

    player_accounts_col = dbClient['snake_irl']['dev_player_accounts']

    player_accounts_col.insert_many( userObjs )


if __name__ == "__main__":
    users = []
    for i in range(50):
        users.append( generateUser() )

    pushUsersToMongo( users )
    pprint.pprint(users)
