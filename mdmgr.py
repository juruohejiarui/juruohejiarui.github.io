import os
import json
class MarkdownInfo (object) :
	def __init__(self, sourcePath, updateTime = None) :
		self.sourcePath : str = sourcePath
		if updateTime == None : self.updateTime = os.path.getmtime(sourcePath)
		else : self.updateTime = updateTime

	def generateHtml(self) :
		# generate the html file
		dstPath : str = self.sourcePath[0 : -3] + ".html"
		os.system("pandoc -s \"{}\" --mathml -o \"{}\"".format(self.sourcePath, dstPath))
		confPath = dstPath + ".json"
		confFile = open(confPath, "w")
		print("Find a new article: " + self.sourcePath)
		print("Please set the configuration for the article.")
		# load title
		print("title (\"{}\" as default): ".format(dstPath[dstPath.find("articles") + 9 : -5]))
		title = input()
		if title == "" : title = dstPath[dstPath.find("articles") + 9 : -5]
		# load labels
		labels = []
		print("labels (separated by \",\"): ")
		labels = input().split(",")
		trueLabels = []
		for label in labels :
			if label != "" :
				trueLabels.append(label)
		# load description
		description = open(self.sourcePath, "r").read(100)
		confFile.write(json.dumps({"title":title, "labels":trueLabels, "description":description }))
		pass
	
def MdMgr_init() :
	# check the update time of the source file
	# compare them with the records from the caches
	_loadCache()
	_updateArticles()
	_saveCache()
	pass

articles : list[MarkdownInfo] = []

def _initCache() :
	oFile = open("cache-md.json", "w")
	oFile.write("[]")
def _loadCache() :
	if not os.path.exists("cache-md.json") :
		_initCache()
	# load the cache files
	# load the article cache
	cacheList = json.load(open("cache-md.json"))
	for article in cacheList :
		articles.append(MarkdownInfo(article["sourcePath"], article["updateTime"]))
		print("Load article: " + article["sourcePath"])

def _updateArticles() :
	for i, article in enumerate(articles) :
		if os.path.exists(article.sourcePath) :
			if os.path.getmtime(article.sourcePath) > article.updateTime :
				articles[i] = MarkdownInfo(article.sourcePath)
				articles[i].generateHtml()
		else :
			articles.remove(article)
	pathSet = set([article.sourcePath for article in articles])
	files = os.listdir("articles")
	for file in files :
		if file.endswith(".md") and (os.path.join("articles", file) not in pathSet) :
			articles.append(MarkdownInfo(os.path.join("articles", file)))
			articles[-1].generateHtml()

def _saveCache() :
	oFile = open("cache-md.json", "w")
	oFile.write(json.dumps([{"sourcePath":article.sourcePath, "updateTime":article.updateTime} for article in articles]))
	oFile.close()