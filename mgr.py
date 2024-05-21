from __future__ import annotations
import os
import json

class Label (object) :
	def __init__ (self, name, index) :
		self.name = name
		self.index = index
		self.articles : list[Article] = []

def getLabel(name : str) -> Label :
	if name not in labelDict :
		# find an empty index
		index = 0
		while index in labelIndexs :
			index += 1
		labelDict[name] = Label(name, index)
		labelIndexs.add(index)
	return labelDict[name]

class Article (object) :
	# load labels and title
	def loadFurtherInfo(self) :
		# read the config file
		configFile = open(self.configPath, "r")
		configDict = json.load(configFile)
		configFile.close()
		# read the title
		self.title = configDict["title"]
		# read the labels
		for label in configDict["labels"] :
			self.labelList.append(getLabel(label))
			getLabel(label).articles.append(self)
		pass
	def __init__(self, sourcePath : str, index : int) :
		self.index = index
		self.sourcePath = sourcePath
		self.configPath = sourcePath + '.json'
		self.updateTime = os.path.getmtime(sourcePath)
		self.labelList : list[Label] = []
		self.loadFurtherInfo()

labelDict : dict[str, Label] = {}
articles : list[Article] = []
articleIndexs : set[int] = set()
labelIndexs : set[int] = set()

# initialize the manager
def Mgr_init() :
	# check the update time of the source file
	# compare them with the records from the caches
	_loadCache()
	_updateArticles()
	_saveCache()
	Mgr_outputArticles()
	Mgr_outputLabels()
	pass

def _initCache() :
	# create the cache files
	outputFile = open("caches.json", "w")
	outputFile.write(f'{{\n\t\"articles\":[],\n')
	outputFile.write(f'\t\"labels\":[]\n}}\n')
	outputFile.close()

def _loadCache() :
	# check if the cache files exist
	# if not, create them
	if not os.path.exists("caches.json") :
		_initCache()
	# load the cache files
	# load the article cache
	cacheDict = json.load(open("caches.json"))
	# read the label dict
	for label in cacheDict["labels"] :
		labelName = label["name"]
		labelDict[labelName] = Label(labelName, label["index"])
		labelIndexs.add(label["index"])
	for article in cacheDict["articles"] :
		articles.append(Article(article["sourcePath"], article["index"]))
		articles[-1].updateTime = article["updateTime"]
		
		articleIndexs.add(article["index"])

def _updateArticles() :
	# check the articles in cache
	for i, article in enumerate(articles) :
		if os.path.exists(article.sourcePath) :
			# check the update time
			if os.path.getmtime(article.sourcePath) > article.updateTime :
				# update the article
				for label in article.labelList :
					label.articles.remove(article)
				articles[i] = Article(article.sourcePath, article.index)
		else : # remove the article
			articles.remove(article)
			for label in article.labelList :
				label.articles.remove(article)
			articleIndexs.remove(article.index)
	# check the new articles
	for file in os.listdir("articles") :
		if file.endswith(".html") :
			# check if the article is already in the list
			articleExist = False
			for article in articles :
				if article.sourcePath == os.path.join("articles", file) :
					articleExist = True
					break
			if not articleExist :
				# find an empty index
				index = 0
				while index in articleIndexs :
					index += 1
				# create the article
				articles.append(Article(os.path.join("articles", file), index))
				articleIndexs.add(index)
	pass

def _saveCache() :
	# save the article cache
	outputFile = open("caches.json", "w")
	outputFile.write(f'{{\n\t"articles":[\n')
	for article in articles :
		outputFile.write(f'\t\t{{\n\t\t\t"sourcePath":\"{article.sourcePath}\",\n\t\t\t"index":{article.index},\n\t\t\t"updateTime":{article.updateTime}')
		outputFile.write(f'\n\t\t}}')
		if article != articles[-1] :
			outputFile.write(f',')
		outputFile.write('\n')
	outputFile.write(f'],\n\t"labels":[\n')
	for label in labelDict.values() :
		outputFile.write(f'\t\t{{\n\t\t\t"name":\"{label.name}\",\n\t\t\t"index":{label.index},\n\t\t\t"articles":[')
		for article in label.articles :
			outputFile.write(f'{article.index}')
			if article != label.articles[-1] :
				outputFile.write(f',')
		outputFile.write(f']\n\t\t}}')
		if label != list(labelDict.values())[-1] :
			outputFile.write(f',')
		outputFile.write('\n')
	outputFile.write(f'\t]\n}}\n')
	pass
	
def Mgr_outputArticles() :
	oFile = open("articles.json", "w")
	oFile.write("[\n")
	for article in articles :
		oFile.write(f'\t{{\n\t\t"index":{article.index},\n\t\t"title":"{article.title}",\n\t\t"labels":[')
		for label in article.labelList :
			oFile.write(f'"{label.name}"')
			if label != article.labelList[-1] :
				oFile.write(',')
		oFile.write(f'],\n\t\t\"file\": \"{article.sourcePath[article.sourcePath.find("articles") + 9 : ]}\"\n\t}}')
		if article != articles[-1] :
			oFile.write(',')
		oFile.write('\n')
	oFile.write(']')

def Mgr_outputLabels() :
	oFile = open("labels.json", "w")
	oFile.write("[\n")
	for label in labelDict.values() :
		oFile.write(f'\t{{"index":{label.index},"name":"{label.name}","articles":[')
		for article in label.articles :
			oFile.write(f'{article.index}')
			if article != label.articles[-1] :
				oFile.write(',')
		oFile.write(']}')
		if label != list(labelDict.values())[-1] :
			oFile.write(',')
		oFile.write('\n')
	oFile.write(']')

# delete an article
def Mgr_deleteArticle(index : int) :
	for article in articles :
		if article.index == index :
			articles.remove(article)
			articleIndexs.remove(index)
			for label in article.labelList :
				label.articles.remove(article)
			break
	_saveCache()

# delete a label
def Mgr_deleteLabel(index : int) :
	for label in labelDict.values() :
		if label.index == index :
			for article in label.articles :
				article.labelList.remove(label)
			labelDict.pop(label.name)
			labelIndexs.remove(index)
			break
	_saveCache()

# add a label
def Mgr_addLabel(name : str) :
	getLabel(name)
	_saveCache()


