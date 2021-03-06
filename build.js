const fs = require('fs')
const spawn = require('child_process').spawnSync

const stencila = require('stencila')

// List of posts, most recent first
let posts = [
  'sloan-grant',
  'thanks-coko',
  'dev-update-2017-03-06',
  'dev-update-2017-01-13',
  'chunks-n-funcs',
  'diverse-peers',
  'geheimhaven',
  'easy-aint-easy',
  'blog-reincarnate',
  'humane-sheets',
  'underneath-sheets',
  'introducing-sheets'
]

// Iterate over posts...
let postsDiv = ''
for (let post of posts) {

  // Create a `Document` for the post
  let doc = new stencila.Document()
  doc.read(post + '/post.md')

  // Write post HTML page
  let html = doc.page({
    edit: '0',
    naked: '1',
    headExtra: `
      <link rel="canonical" href="http://blog.stencila/${post}" />
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/stencila-web@0.2.0/build/document.min.css">
    `,
    header: 
      `<style>
        body {
          margin: 0;
        }
        header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100000;
          padding: 0.5em 0 0 0.3em;
          border-bottom: 1px solid #EEE;
          margin-bottom: 1em;
          background: white;
          opacity: 0.97;
        }
        header > div {
          max-width: 41.5em;
          margin-left: auto;
          margin-right: auto;
        }
        header img {
          width: 9em;
        }
        #data .content,
        .sc-visual-editor .se-scrollable .se-content {
          margin-top: 3em;
          max-width: 40em;
          font-size: 120%;
        }
      </style>
      <div>
        <a href="http://blog.stenci.la"><img src="../logo-name.svg"></a>
      </div>
      `,
    footer:
      `<script src="https://unpkg.com/stencila-web@0.2.0/build/document.min.js"></script>`
  })
    // Replace the replaces CSS and JS
    .replace('<link rel="stylesheet" type="text/css" href="https://unpkg.com/stencila-web/build/document.min.css">', '')
    .replace('<script src="https://unpkg.com/stencila-web/build/document.min.js"></script>', '')
    
  fs.writeFile(post + '/index.html', html)

  // Generate summary for main page
  postsDiv += `<div class="post">
  <div class="title"><a href="${post}">${doc.title}</a></div>
  <div>
    <div class="author">${doc.authors.join(', ')}</div>
    <div class="date">${doc.date}</div>
  </div>
  <div class="summary">${doc.summary || ''}</div>
</div>\n`
  
}

// Main index page
fs.writeFile('index.html',
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="generator" content="stencila-node-0.1.0">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" type="text/css" href="theme.css">
    </head>
    <body class="index">
      <div class="header">
        <img src="logo-name.svg">
      </div>
      <div class="posts">${postsDiv}</div>
      <div class="footer"></div>
    </body>
  </html>`
)
