{-# LANGUAGE DeriveGeneric         #-}
{-# LANGUAGE DeriveAnyClass        #-}
{-# LANGUAGE OverloadedStrings     #-}
{-# LANGUAGE DuplicateRecordFields #-}

module Main where

import Control.Lens ((?~), at)
import Control.Monad (void)
import Data.Aeson (FromJSON, ToJSON, Value (Object, String), toJSON)
import Data.Aeson.Lens (_Object)
import qualified Data.HashMap.Lazy as HML
import qualified Data.Text as T
import Data.Time
  ( UTCTime, defaultTimeLocale, formatTime, getCurrentTime
  , iso8601DateFormat, parseTimeOrError)
import Development.Shake
  ( Action, Verbosity(Verbose), copyFileChanged, forP, getDirectoryFiles
  , liftIO, readFile', shakeLintInside, shakeOptions, shakeVerbosity
  , writeFile')
import Development.Shake.Classes (Binary)
import Development.Shake.FilePath ((</>), (-<.>), dropDirectory1)
import Development.Shake.Forward (cacheAction, shakeArgsForward)
import GHC.Generics (Generic)
import Slick (compileTemplate', convert, markdownToHTML, substitute)
import Text.RawString.QQ


---Config-----------------------------------------------------------------------

siteMeta :: SiteMeta
siteMeta =
    SiteMeta { siteAuthor = "Owen Leather"
             , baseUrl = "https://example.com"
             , siteTitle = "Owen's Website"
             , linkedin = Just "owenleather"
             , githubUser = Just "oleather"
             }

outputFolder :: FilePath
outputFolder = "docs/"

generatedFolder :: FilePath
generatedFolder = "src/generated/"

activeNav :: String
activeNav = [r|block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500|]

deactiveNav :: String
deactiveNav = [r|block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700|]

--Data models-------------------------------------------------------------------

withSiteMeta :: Value -> Value
withSiteMeta (Object obj) = Object $ HML.union obj siteMetaObj
  where
    Object siteMetaObj = toJSON siteMeta
withSiteMeta _ = error "only add site meta to objects"

data SiteMeta =
    SiteMeta { siteAuthor    :: String
             , baseUrl       :: String -- e.g. https://example.ca
             , siteTitle     :: String
             , linkedin :: Maybe String
             , githubUser    :: Maybe String
             }
    deriving (Generic, Eq, Ord, Show, ToJSON)

data NavConfig = 
    NavConfig {
            homeClass :: String,
            aboutClass :: String,
            projectsClass :: String
            }
    deriving (Generic, Eq, Ord, Show, ToJSON)

-- | Data for the index page
data IndexInfo =
  IndexInfo
    { posts :: [Post]
    } deriving (Generic, Show, FromJSON, ToJSON)


data NavInfo = 
  NavInfo {
    nav :: String
  } deriving (Generic, Show, FromJSON, ToJSON)

type Tag = String

-- | Data for a blog post
data Post =
    Post { title       :: String
         , author      :: String
         , content     :: String
         , url         :: String
         , date        :: String
         , tags        :: [Tag]
         , description :: String
         , image       :: Maybe String
         }
    deriving (Generic, Eq, Ord, Show, FromJSON, ToJSON, Binary)

data AtomData =
  AtomData { title        :: String
           , domain       :: String
           , author       :: String
           , posts        :: [Post]
           , currentTime  :: String
           , atomUrl      :: String } deriving (Generic, ToJSON, Eq, Ord, Show)

-- | given a list of posts this will build a table of contents
buildIndex :: Action ()
buildIndex = do
  buildNav NavConfig { homeClass = activeNav, aboutClass = deactiveNav, projectsClass = deactiveNav} 
  indexT <- compileTemplate' "src/templates/index.html"
  let indexInfo = toJSON IndexInfo {posts = []}
  let indexHTML = T.unpack $ substitute indexT (withSiteMeta indexInfo)
  writeFile' (outputFolder </> "index.html") indexHTML

buildAbout :: Action ()
buildAbout = do
  buildNav NavConfig { homeClass = deactiveNav, aboutClass = activeNav, projectsClass = deactiveNav} 
  aboutT <- compileTemplate' "src/templates/about.html"
  let aboutInfo = toJSON IndexInfo {posts = []}
  let aboutHTML = T.unpack $ substitute aboutT (withSiteMeta aboutInfo)
  writeFile' (outputFolder </> "about.html") aboutHTML

buildProjects :: [Post] -> Action ()
buildProjects posts' = do
  buildNav NavConfig { homeClass = deactiveNav, aboutClass = deactiveNav, projectsClass = activeNav} 

  projectsT <- compileTemplate' "src/templates/projects.html"
  let projectsInfo = IndexInfo {posts = posts'}
      projectsHTML = T.unpack $ substitute projectsT (withSiteMeta $ toJSON projectsInfo)
  
  writeFile' (outputFolder </> "projects.html") projectsHTML


buildBlog :: [Post] -> Action ()
buildBlog posts' = do
  buildNav NavConfig { homeClass = activeNav, aboutClass = deactiveNav, projectsClass = deactiveNav} 

  blogT <- compileTemplate' "src/templates/blog.html"
  let blogInfo = IndexInfo {posts = posts'}
      blogHTML = T.unpack $ substitute blogT (withSiteMeta $ toJSON blogInfo)
  
  writeFile' (outputFolder </> "blog.html") blogHTML



buildNav :: NavConfig -> Action ()
buildNav navConfig = do
  navT <- compileTemplate' "src/templates/nav.html"
  let navHTML = T.unpack $ substitute navT (toJSON navConfig)
  writeFile' (generatedFolder </> "nav.html") navHTML

 

-- | Find and build all posts
buildPosts :: Action [Post]
buildPosts = do
  buildNav NavConfig { homeClass = deactiveNav, aboutClass = deactiveNav, projectsClass = activeNav} 
  pPaths <- getDirectoryFiles "." ["src/posts//*.md"]
  forP pPaths buildPost

-- | Load a post, process metadata, write it to output, then return the post object
-- Detects changes to either post content or template
buildPost :: FilePath -> Action Post
buildPost srcPath = cacheAction ("build" :: T.Text, srcPath) $ do
  liftIO . putStrLn $ "Rebuilding post: " <> srcPath
  postContent <- readFile' srcPath
  -- load post content and metadata as JSON blob
  postData <- markdownToHTML . T.pack $ postContent
  let postUrl = T.pack . dropDirectory1 $ srcPath -<.> "html"
      withPostUrl = _Object . at "url" ?~ String postUrl
  -- Add additional metadata we've been able to compute
  let fullPostData = withSiteMeta . withPostUrl $ postData
  template <- compileTemplate' "src/templates/post.html"
  writeFile' (outputFolder </> T.unpack postUrl) . T.unpack $ substitute template fullPostData
  convert fullPostData

 
-- | Copy all static files from the listed folders to their destination
copyStaticFiles :: Action ()
copyStaticFiles = do
    filepaths <- getDirectoryFiles "./src/" ["images//*", "css//*", "js//*"]
    void $ forP filepaths $ \filepath ->
        copyFileChanged ("src" </> filepath) (outputFolder </> filepath)


-- | Specific build rules for the Shake system
--   defines workflow to build the website
buildRules :: Action ()
buildRules = do
  allPosts <- buildPosts
  buildIndex
  buildAbout
  buildProjects allPosts
  buildBlog allPosts
  copyStaticFiles

main :: IO ()
main = do
  let shOpts = shakeOptions { shakeVerbosity = Verbose, shakeLintInside = ["\\"]}
  shakeArgsForward shOpts buildRules


