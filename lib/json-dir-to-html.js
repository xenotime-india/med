
function dirArrayToTree(arr){

  let parsed =arr.map(path=>path.split('/'))

  let result = {}

  parsed.forEach(pathArray=>{
    recurse(result, [].concat(pathArray),0)
  })

  function recurse(obj, arr, index) {
    if (index === arr.length) return
    let val = arr[index].replace(/_/g," ")
      .replace(/\s[a-z]/g,function(f){return f.toUpperCase();})
      .replace(/^[a-z]/g,function(f){return f.toUpperCase();})
      .replace(/.md|.html$/,'')

    if (!obj[val]) {
      if (!arr[index+1]) {
        obj[val] = arr.slice(0,index+1).join('/')
      }
      else {
        obj[val] = {
          _meta: {
            depth: index+1
          }
        }
      }
    }
    recurse(obj[val], arr, index+1)
  }
  return result
}

function buildHTML(key, val, meta = {}) {

  if (typeof val === "string") {
    let href = val.replace(/.md$/,'.html')
    return `<li><a href="/${href}">${key}</a></li>`
  }

  let heading = "";
  let htag = (t) => t;

  if (key) {
    heading = `<h3>${key}</h3>`
  }

  if (meta && meta.depth) {
    htag = (t)=>`<h${meta.depth}>${t}</h${meta.depth}>`
  }

  function wrapList(text) {
    if (typeof key !== "undefined") {
      return `<li>${htag(key)}${text}</li>`
    } else {
      return text
    }
  }

  let nextList = Object.keys(val)
    .filter(k=>k!=="_meta")
    .map(k => buildHTML(k, val[k], val[k]['_meta']))
    .join("\n") 

  return wrapList(`<ul>${nextList}</ul>`)

}

module.exports = function(dirArray){
  let dirTree = dirArrayToTree(dirArray)
  return buildHTML(undefined,dirTree,{})
}

