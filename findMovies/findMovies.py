import requests
from requests.structures import CaseInsensitiveDict

def isNotBlank (myString):
    if myString and myString.strip():
        return True
    return False


class getMovie(object):
    
    def __init__(self, type = 'movie', title = 'hobbit'):
            self.type = type
            self.title = title
            self.movies = {}
            self.url = ''
    def getHeaders(self):
        headers = {
            'authority': 'zalukajvod.eu',
            'accept': 'application/xhtml+xml',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-dest': 'empty',
            'referer': 'https://zalukajvod.eu/pl',
            'accept-language': 'en-US,en;q=0.9',
        }
        return headers


    def getParams(self):
        params = (
            ('search', self.title),#seriees or movie
            ('type', self.type),
        )
        return params

    def searchZalukaj(self):
        response = requests.get('https://zalukajvod.eu/api/search', headers=self.getHeaders(), params=self.getParams())
        html = response.json()['data']
        html = str(html)

        movies = self.movies
        while html.find("span class=\"ang\">") != -1:
            margin = 17
            index = html.find("span class=\"ang\">") + margin
            title = html[index:index+100]
            print(title)
            title = title.replace('<', ',')
            title = title.split(',')[0]

            html = html[index + +len(title) + 21: -1]
            
            index = html.find("https://")
            link = html[index:index+100]
            link = link.split("'")[0]   
            movies[title] = link
        
            self.movies = movies
        return movies

    def pickMovie(self):
        movieDict = {}
        if self.movies == {}:
            print('No movies with that title ware found')
        titleInput = 1
        print('choose a movie by index:')
        for index, titleAndLink in enumerate(self.movies.items(), start = 1):
            print(f'{index} {titleAndLink[0]}')
            movieDict[index] = titleAndLink[1]
        while True:
            try:
                titleInput = int(input('your choice:\n>'))
                break
            except ValueError:
                print("Sorry, I didn't understand that.")
        self.url  = movieDict[titleInput]
        return movieDict[titleInput]


    def inputType(self):
        typeInput = 1
        print('type 1 for a movie or 2 for a tv series')
        while True:
            try:
                typeInput = int(input('your choice:\n> '))
                if typeInput in (1,2):
                    break
                else:
                    print(typeInput)
                    raise ValueError
                    
            except ValueError:
                print("Sorry, I didn't understand that.")
        
        if typeInput == 1:
            self.type = "movie"
        elif typeInput == 2:
            self.type = "series"

    def inputMovie(self):
        movieInput = (input('whats the title? \n>'))
        self.title = movieInput;


    def checkStramingOptions(self):
        url = self.url
        #url = "https://zalukajvod.eu/pl/film-online/hobbit--bitwa-pieciu-armii-122917"
        headers = CaseInsensitiveDict()
        headers["authority"] = "zalukajvod.eu"
        headers["upgrade-insecure-requests"] = "1"
        headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        headers["accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        headers["sec-gpc"] = "1"
        headers["sec-fetch-site"] = "same-origin"
        headers["sec-fetch-mode"] = "navigate"
        headers["sec-fetch-user"] = "?1"
        headers["sec-fetch-dest"] = "document"
        headers["referer"] = "https://zalukajvod.eu/pl/search?title=hobbit"
        headers["accept-language"] = "en-US,en;q=0.9"
        headers["cookie"] = "XSRF-TOKEN=eyJpdiI6IlM3aytQN2VIcnNxeUo5TjZJeXRRZ0E9PSIsInZhbHVlIjoiXC9lUXl3TVBzUHNOaU9wUjFKeXlncDhwM2xOMVZxc1k2TTNZaXVYSkExaHc1bVNTeHA5Z1BnVjZuYm9USjA5OFY2T2RlNVo1aFI4MTdZQ1RPcnBUZGF2T2phSE9IbytRdlgrWGkxdWhpNVQ2ZDJreEZFMFY0VjdDMkZQc1MyUXdRIiwibWFjIjoiODE3ZjhmZGUxNjQxOGI5NTUxNzY3NDU4NWQ0YzUxZGVhMzU4MTFmNzA0ZDg3YmU0YmI4YmVjNzM1Y2Q3OWFlYyJ9; zalukajvodeu_session=eyJpdiI6Ind3WTVvaUN5alVIejFkU1NHQmtJOUE9PSIsInZhbHVlIjoiMnFBTGhZMEJiWHduZlNYQ3lQN3FYSlk5cGhhTno1SUluUGVIOXR1TkdJbjhjVXVpZmNCY2JaZkk3aHpybDZjZFhObjBZYmRlNHlYM3JoelFRR2xuQXJGNFwvYVFXXC9QclwvSFBCcnV3T2lCYVNtVnAwSnNqUEJqQWRzYzUxRlVnWmwiLCJtYWMiOiIwMjVjYjhjNTU5NTEyZTE0OTQ1ZTE2ZTgyYjI5Y2Y2NGNhOThkZjY0MGQ1MmU5MTlhMWUxZjQyYzMwYzg5NTkwIn0%3D"
        headers["dnt"] = "1"

        r = requests.get(url, headers=headers)
        resp = r.text
        platforms =  {}
        netflixID = '/img/providers/netflix.png'
        hboID = '/img/providers/hbo_go.png'
        primeID = '/img/providers/amazon_prime_video.png'   
        
        index = resp.find(netflixID)
        netflixStr = resp[index:index + len(netflixID)]

        index = resp.find(hboID)
        hboStr = resp[index:index + len(hboID)]

        index = resp.find(primeID)
        primeStr = resp[index:index + len(primeID)]

        platforms['netflix'] = netflixStr
        platforms['hbo'] = hboStr
        platforms['prime'] = primeStr
        returnStr = ''
        for platform in platforms:
            if platforms[platform]:
                returnStr += (platform) + " " + "\n"
        return(returnStr)


#type = input('type')
#title = input('title:')
movies = getMovie()
movies.inputType()
movies.inputMovie()
movies.searchZalukaj()
movies.pickMovie()
print(movies.checkStramingOptions())