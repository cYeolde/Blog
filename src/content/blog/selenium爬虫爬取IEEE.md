---
author: 浥青城
pubDatetime: 2023-03-07T08:22:21
title: selenium爬虫爬取IEEE
postSlug: selenium爬虫爬取IEEE
featured: true
draft: false
tags:
  - Python
description: ""
---
这里为了方便读者迁移和阅读，我把所有代码都呈现在了博客中，并且按顺序分隔在全篇中，也就是按顺序把代码块组合到一起就可以拿着执行。

首先是导入所需包：
``` python
from lxml import etree
import requests
import pymysql
import time
import os
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from PyPDF2 import PdfReader
from selenium import webdriver
# 在这里导入浏览器设置相关的类
from selenium.webdriver.edge.options import Options
from selenium.webdriver.chrome.service import Service
# 无可视化界面设置 #
```
然后是设置无头模式，selenium的爬取原理就是机器人模拟人类点击网页进行操作，这也就是传统的有头模式，无头模式则可以不在屏幕上自动打开网页和完全渲染，就可以实现机器点击操作。但是如果要实现完全无头模式，需要写程序对edge浏览器默认设置进行改动，因此我偷懒，选择用有头模式，对默认设置进行手动修改，所以这个方法反而悬而未用。
``` python
edge_options = Options()
# 使用无头模式
edge_options.add_argument('--headless')
# 禁用GPU，防止无头模式出现莫名的BUG
edge_options.add_argument('--disable-gpu')
```
xxxxxxxxxx3 1$ hexo clean2$ hexo g3$ hexo sbash
``` python
def _getUrls_list():  # 爬取IEEE的所有所需期刊的函数
    periodical_list = {
        "https://dblp.uni-trier.de/db/journals/tcad/",
        "https://dblp.uni-trier.de/db/journals/tc/",
        "https://dblp.uni-trier.de/db/journals/tpds/",
        "https://dblp.uni-trier.de/db/journals/jsac/",
        "https://dblp.uni-trier.de/db/journals/tmc/",
        "https://dblp.uni-trier.de/db/journals/ton/",
        "https://dblp.uni-trier.de/db/journals/tdsc/",
        "https://dblp.uni-trier.de/db/journals/tifs/",
        "https://dblp.uni-trier.de/db/journals/tse/",
        "https://dblp.uni-trier.de/db/journals/tsc/",
        "https://dblp.uni-trier.de/db/journals/tkde/",
        "https://dblp.uni-trier.de/db/journals/tit/",
        "https://dblp.uni-trier.de/db/journals/tip/",
        "https://dblp.uni-trier.de/db/journals/tvcg/",
        "https://dblp.uni-trier.de/db/journals/pami/",
        "https://dblp.uni-trier.de/db/journals/pieee/"
    }
    driver = webdriver.Edge(options=edge_options)
    urls_list = []
    for pe in periodical_list:
        driver.get(pe)
        for element in driver.find_elements(By.XPATH,
                                             "//div[@id='main']/ul/li/a"):
            urls_list.append(element.get_attribute("href").strip())
    return urls_list


def getUrls_list():  # 爬取IEEE的TCAD期刊函数
    print("0")
    all_items = 42
    urls_list = []
    part_str = "https://dblp.uni-trier.de/db/journals/tcad/"
    for i in range(all_items + 1):
        channel = part_str + "tcad" + str(all_items - i) + ".html"  # i+1
        urls_list.append(channel)
    return urls_list
headers = {'User-Agent': "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)"}

```
以下则是负责提取信息的函数，需要注意的是，我分为了read_webpage和read_pdf两个函数，这也是必须分开的，因为完整的需爬信息包括了作者、单位、标题等等基本信息和投稿周期信息，而IEEE的特点就是投稿周期信息在网页上不可见，需要下载PDF之后从PDF文件中提取对应信息，才能完整满足爬取的需求。

对于read_webpage，大体思路是从遍历函数中获取urls（例如：TCAD期刊的volume42这一小期的所有论文url的列表），然后循环get每一篇论文，从中获取网页端能查到的所有论文所需信息，这里我为了减少作者重名的影响，为之后的数据分析提供更加优质的数据集，我采用了分表的一个粗略的解决方案，这也是基于IEEE单个网站的特性（对于每个作者都有一个url为作者详情页，可以理解为每个IEEE的作者都有一个学术身份证，利用这个可以为解决作者重名的问题提供一个思路），具体分表方式可以从代码中获悉。然后因为要控制read_pdf的文件指针遍历所下载的PDF文件，需要同时获知PDF的下载文件名，这里网站的论文标题并不完全对应所下载的PDF文件名，所以对爬取到的论文标题需要进行字段处理，也就是通过replace函数进行一些替换。

对于read_pdf，采用pyPDF的支持函数，通过查找投稿周期信息的名字来访问到所需信息并拼接存入列表。
``` python
# 获取一期论文的下载路径列表title_list_valume和作者信息（该信息为总体信息的前半部分）列表all_list_ahead
def read_webpage(urls, driver, title_list_valume,all_list_ahead,AMOUNT):
    amount = 0
    for i in range (AMOUNT):
        driver.get(urls[i])
        _url = driver.current_url + str("/authors#authors")  #  后面部分需要使用
        title = driver.find_element(By.XPATH, "//div[@class='global-ng-wrapper']//h1/span").text  # 文章标题
        _title = title
        __url = driver.current_url
        __url = "https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=" + __url[-7:]
        driver.get(__url)
        # 切换iframe
        iframe = driver.find_element(By.XPATH, "//body/iframe[@src]")
        driver.switch_to.frame(iframe)
        # 下载
        driver.find_element(By.XPATH, "//a").click()
        _title = _title.replace(';', '')
        _title = _title.replace('(', '')
        _title = _title.replace(')', '')
        _title = _title.replace('"', '')
        _title = _title.replace("’", "")
        _title = _title.replace("'", "")
        _title = _title.replace(',', '')
        _title = _title.replace(':', '')
        _title = _title.replace('/', '_')
        _title = _title.replace(" ", "_")
        _title = _title.replace("\n", "_")
        filename = 'C:/Users/Ryan0710/Downloads/' + str(_title) + ".pdf"
        title_list_valume.append(filename)  # 文件路径列表
        time.sleep(1)

        authors = []
        au_url = []
        _driver = webdriver.Edge(options=edge_options)
        _driver.get(_url)
        for element in _driver.find_elements(By.XPATH,
                                 "//*[@id='authors']//xpl-author-item/div//a/span"):
            authors.append(element.text)
        for element in _driver.find_elements(By.XPATH,
                                 "//*[@id='authors']//xpl-author-item/div/div[1]/div/div[1]/a"):
            au_url.append(element.get_attribute("href").strip())
        for i2 in range(len(authors)):
            au_unit = []
            for element in _driver.find_elements(By.XPATH,
                                         "//*[@id='authors']/div[{}]/xpl-author-item/div/div/div/div/div".format(i2 + 1)):
                au_unit.append(element.get_attribute("innerHTML").strip())
            while len(au_unit) < 4:
                au_unit.append(None)
            ll = [[authors[i2], au_url[i2], au_unit[0], au_unit[1], au_unit[2]]]
            print(ll)
            sql_2 = "INSERT INTO author_affiliation values(%s,%s,%s,%s,%s)"  # 这是一条sql插入语句
            cur.executemany(sql_2, ll)  # 执行sql语句，并用executemany()函数批量插入数据库中
        while len(au_url) < 11:  # 有的作者没有单位,这样少一个判断语句，而且多出的作者也是none,没有录进sql也无妨
            au_url.append(None)
        while len(authors) < 11:
            authors.append(None)
        doi = urls[i]
        l = [[title, doi, authors[0], authors[1],
        authors[2], authors[3], authors[4], authors[5], authors[6], authors[7], authors[8], authors[9],
        au_url[0], au_url[1], au_url[2], au_url[3], au_url[4], au_url[5], au_url[6], au_url[7], au_url[8], au_url[9]]]
        # 将l按照插入到all_list[amount]中
        all_list_ahead[i] = l
    return title_list_valume

def read_pdf(path_list):    # 利用路径列表从pdf文件中获取含周期信息的文段列表，并将之返回
    sub_list = []
    for _FileName in path_list:

        f = open(_FileName, "rb")
        pdf = PdfReader(f)
        first_page = pdf.pages[0]
        target_str = first_page.extract_text()
        i = target_str.find("Manuscript received")
        target_str = target_str[i:]
        k1 = target_str.find("This")
        k2 = target_str.find("The")
        j = k1
        if k1 > k2:
            j = k2
        answer = ""
        for x in range(0, j):
            if target_str[x] != '-':
                answer += target_str[x]
        sub_list.append(answer)  # 含有该文件周期信息的文段
        f.close()  # 关闭对该文件的读取

    return sub_list
```
CreateDriver是设置浏览器无头模式参数的函数，getUrls则是查询每一小期获取每一小期的所有url路径的函数，而Login是负责登录的函数，这里我是利用了学校的免费下载权，也就是通过学校的webvpn登录校园账号进行免费下载，如果在校园中，有时候连接校园网的时候，因为浏览器被组织托管，可能会出现自动登录的情况，那么把main函数中的Login注释掉就行。
``` python
def CreateDriver():     # 设置浏览器的无头模式
    # 创建EdgeOptions对象，设置无头模式
    edge_options = Options()
    edge_options.use_chromium = True
    # 创建EdgeDriver对象，设置EdgeDriver路径和EdgeOptions参数
    service = Service('C:/Users/Ryan0710/.cache/selenium/msedgedriver/win64/110.0.1587.63/msedgedriver.exe')
    driver = webdriver.Edge(service=service, options=edge_options)
    # 等待页面加载完成
    driver.implicitly_wait(10)
    return driver

def getUrls(Item_Urls_list):    # 从urls_list中获得某期文章的urls并返回
    urls = Item_Urls_list
    r = requests.get(urls)
    r.encoding = r.apparent_encoding
    demo = r.text
    html = etree.HTML(demo)
    return html.xpath("/html/body/div[@id='main']/ul[@class]//li[@class='ee']/a[@href]/@href")

def Login(url, driver): # 利用url所给的文章页面进行登录，并返回浏览器的driver
    driver.get(url)
    driver.find_element(By.XPATH,
                        "//div[@class='global-ng-wrapper']//i[@class='icon far fa-file-pdf']/following-sibling::*[1]").click()
    driver.find_elements(By.XPATH,
                         "//button[@class='stats-Doc_Details_sign_in_seamlessaccess_access_through_your_institution_btn']")[
        0].click()
    webElement = driver.find_elements(By.XPATH, "//input")[1]
    webElement.send_keys("Jilin University")
    time.sleep(0.5)
    webElement.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.5)
    webElement.send_keys(Keys.ENTER)
    time.sleep(0.5)
    driver.find_element(By.XPATH, "//input[@id='username']").send_keys("xujy5521")
    driver.find_element(By.XPATH, "//input[@id='password']").send_keys("1975LIliabili")
    driver.find_element(By.XPATH, "//button").click()
    print("Login successfully")
    return driver
```
main函数中主要进行了获取的周期信息列表中字段的截取，把需要的截取出来，并重新插入新的列表中，方便合成并插入数据库。
``` python
def main():
    urls_list = getUrls_list()  # urls的页面是某月全部论文的集合
    urls = getUrls(urls_list[0])  # 从一个urls中提取出该月所有论文的url并将其集成为列表
    url = urls[0]  # 获取该月集合中的某一篇论文的url
    driver = CreateDriver()  # 创建无头浏览器
    # 此处根据是否默认登录决定是否使用Login函数
    driver = Login(url, driver)  # 利用该论文的界面进行登录，并将登陆后的浏览器driver返回用于后续操作
    for urls in urls_list:
        print(urls)
        r = requests.get(urls)
        r.encoding = r.apparent_encoding
        demo = r.text
        html = etree.HTML(demo)
        urls = html.xpath("/html/body/div[@id='main']/ul[@class]//li[@class='ee']/a[@href]/@href")
        TitleList_valum = []  # 文件路径列表
        AMOUNT = len(urls) # 该页面的文章数量
        all_list = [[0 for col in range(27)] for row in range(AMOUNT)]
        all_list_ahead = [[0 for col in range(22)] for row in range(AMOUNT)]
        path_list = read_webpage(urls, driver, TitleList_valum, all_list_ahead,AMOUNT)
        sublist = read_pdf(path_list)
        for i in range(AMOUNT):
            behind = []
            answer = sublist[i]
            posofDate = answer.find("Date")
            First_Setence = answer[0:posofDate]  # .在该字符串中
            Second_Setence = answer[posofDate:]
            strlist = First_Setence.split(';')
            Second_strlist = Second_Setence.split(';')
            pos1 = strlist[0].find("eceived")
            # 将周期信息插入到all_list[amount]中
            behind.append(strlist[0][pos1 + 7:].replace('\n', ' '))
            pos2 = strlist[1].find("evised")
            behind.append(strlist[1][pos2 + 6:].replace('\n', ' '))
            pos3 = strlist[2].find("ccepted")
            behind.append(strlist[2][pos3 + 7:].replace('\n', ' '))
            if Second_Setence.find("publication") != -1:
                pos4 = Second_strlist[0].find("ublication")
                behind.append(Second_strlist[0][pos4 + 10:].replace('\n', ' '))
                pos5 = Second_strlist[1].find("ersion")
                behind.append(Second_strlist[1][pos5 + 6:-2].replace('\n', ' '))

            else:
                behind.append(None)
                pos5 = Second_strlist[1].find("ersion")
                behind.append(Second_strlist[1][pos5 + 6:-2].replace('\n', ' '))
            ala = []
            for ii in all_list_ahead[i]:
                    for jj in ii:  # 否则，正常迭代 ii 中的元素
                        ala.append(jj)

            all_list[i] = ala + behind
        sql_1 = "INSERT INTO all_paper values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"  # 这是一条sql插入语句
        cur.executemany(sql_1, all_list)  # 执行sql语句，并用executemany()函数批量插入数据库中
        conn.commit()  # 提交到数据库执行

        for path in TitleList_valum:  # 读取文件路径列表，并删除文件
            os.remove(path)
    # 释放数据连接
    if cur:
        cur.close()
    if conn:
        conn.close()
```
接下来进行的就是pymysql的链接pycharm和MySQL的工作，下面需要用户填入自己的账号密码，建议都用管理员账户。
``` python

conn = pymysql.connect(user="root", password="", database="ieee", charset='utf8')
cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS all_paper')  # 如果数据库中有all_paper的数据库则删除
sql_1 = """CREATE TABLE all_paper(
        title VARCHAR(511) NOT NULL,
        DOI CHAR(255),
        author_1 CHAR(255),
        author_2 CHAR(255),
        author_3 CHAR(255),
        author_4 CHAR(255),
        author_5 CHAR(255),
        author_6 CHAR(255),
        author_7 CHAR(255),
        author_8 CHAR(255),
        author_9 CHAR(255),
        author_10 CHAR(255),
        au_url_1 CHAR(255),
        au_url_2 CHAR(255),
        au_url_3 CHAR(255),
        au_url_4 CHAR(255),
        au_url_5 CHAR(255),
        au_url_6 CHAR(255),
        au_url_7 CHAR(255),
        au_url_8 CHAR(255),
        au_url_9 CHAR(255),
        au_url_10 CHAR(255),
        Received CHAR(255),
        Revised CHAR(255),
        Accepted CHAR(255),
        Publication CHAR(255),
        Current_version CHAR(255)
 )ENGINE = InnoDB DEFAULT CHARSET = utf8;"""
cur.execute(sql_1)  # 执行sql语句，新建一个all_paper的数据库
# author_affiliation
cur.execute('DROP TABLE IF EXISTS author_affiliation')  # 如果数据库中有author_affiliation的数据库则删除
sql_2 = """CREATE TABLE author_affiliation(
        author CHAR(255) NOT NULL,
        au_url CHAR(255),
        unit_1 VARCHAR(511),
        unit_2 VARCHAR(511),
        unit_3 VARCHAR(511)
 )ENGINE = InnoDB DEFAULT CHARSET = utf8;"""
cur.execute(sql_2)  # 执行sql语句，新建一个author_affiliation的数据库

main()
```
