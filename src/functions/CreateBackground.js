export function CreateBackground () {
  // Creating and inserting 3 divs containing the background applied to the pages
  const bklocation = document.getElementById('container')
  const menu = document.getElementById('menu')
  const bk = document.createElement('div')
  bk.classList.add('bg')

  bklocation.insertBefore(bk, menu)

  const bk2 = document.createElement('div')
  bk2.classList.add('bg')
  bk2.classList.add('bg2')
  bklocation.insertBefore(bk2, menu)

  const bk3 = document.createElement('div')
  bk3.classList.add('bg')
  bk3.classList.add('bg3')
  bklocation.insertBefore(bk3, menu)
}
