//git@github.com:EliLillyCo/lusa-psd-documentation.git


const { existsSync } = require('fs')
const { execSync } = require('child_process')



module.exports = 
  function fetch(
  repo = 'git@github.com:EliLillyCo/lusa-psd-documentation.git',
  tDir
){

  let currentDir = __dirname

  let targetDir = tDir || (repo.split('/').splice(-1)[0] || '').replace(/.git$/,"")

  if (!targetDir) throw new Error(`Cannot make sense of this ${tagetDir}`)

  if (existsSync(targetDir)) {
    console.log(`medusa: target dir exists '${targetDir}', fetching latest master...`)
    //prompt target dir exists treating as repo y/n?
    //currentDir = 

    try {
      let pwd = execSync(`pwd`, { cwd: targetDir })
      execSync(`git fetch`, { cwd: targetDir })
      execSync(`git checkout origin/master`, { cwd: targetDir })
    } catch(e){
      throw new Error(`medusa: Error checking out repo in ${targetDir}`)
    }

  }

  else {
    try {
      execSync(`git clone ${repo} ${targetDir}`)
    } catch(e){
      throw new Error(`medusa: Error fetching documentation repo: ${repo}`)
    }
  }

}

