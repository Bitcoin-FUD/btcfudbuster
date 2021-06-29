import toml from 'toml'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
const __dirname = path.resolve()

const allMaterial = glob.sync(__dirname + '/material/**/*.toml')
  .map(path => fs.readFileSync(path, { encoding: 'utf-8'}))
  .map(file => toml.parse(file))

console.log(allMaterial)

/**
 * @description Method to get random element from array
 * @param {*[]} arr the array
 * @returns {*} random element
 * @example random(['a', 'b', 'c'])
 */
export const random = arr => {
  return arr[Math.floor(Math.random() * arr.length)]
}
export const getMostRelevantAnswer = query => {
  let answers = allMaterial
    .map(material => {
      material.hits = query
        .split(' ')
        .filter(keyword => material.tags.indexOf(keyword) !== -1)
        .length

      return material
    })
    .filter(material => material.hits > 0)
    .sort((a, b) => a.hits > b.hits ?
      1 :
      a.hits < b.hits ?
      -1 :
      Math.random() < .5 ? 1 : -1
    )

  let mostRelevantAnswer = answers.pop()
  if (!mostRelevantAnswer) return null

  let url = random(mostRelevantAnswer.links)
  return `${mostRelevantAnswer.answer} ${url}`
}