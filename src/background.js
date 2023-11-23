import { onError } from './functions/onError'
const browser = require('webextension-polyfill')
function ReloadSEQTAPages () {
  browser.tabs.query({}, function (tabs) {
    for (const tab of tabs) {
      if (tab.title.includes('SEQTA Learn')) {
        browser.tabs.reload(tab.id)
      }
    }
  })
}

browser.runtime.onMessage.addListener(function (request, sender) {
  if (request.type === 'reloadTabs') {
    ReloadSEQTAPages()
  } else if (request.type === 'githubTab') {
    browser.tabs.create({ url: 'https://github.com/crazypersonalph/betterseqta' })
  } else if (request.type === 'setDefaultStorage') {
    console.log('setting default values')
    SetStorageValue(DefaultValues)
  } else if (request.type === 'addPermissions') {
    if (typeof (browser.declarativeContent) !== 'undefined') {
      browser.declarativeContent.onPageChanged.removeRules(undefined, function () {
      })
    }
    browser.permissions.request({ permissions: ['declarativeContent'], origins: ['*://*/*'] }, function (granted) {
      if (granted) {
        const rules = [
          {
            conditions: [
              new browser.declarativeContent.PageStateMatcher({
                pageUrl: { urlContains: 'site.seqta.com.au', schemes: ['https'] }
              })
            ],
            actions: [new browser.declarativeContent.RequestContentScript({ js: ['seqta.js'] })]
          },
          {
            conditions: [
              new browser.declarativeContent.PageStateMatcher({
                pageUrl: { urlContains: 'learn.', schemes: ['https'] }
              })
            ],
            actions: [new browser.declarativeContent.RequestContentScript({ js: ['seqta.js'] })]
          }

        ]
        for (let i = 0; i < rules.length; i++) {
          browser.declarativeContent.onPageChanged.addRules([rules[i]])
        }
        alert("Permissions granted. Reload SEQTA pages to see changes. If this workaround doesn't work, please contact the developer.")
      }
    })
  }
})

browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type === 'sendNews') {
      // Gets the current date
      const date = new Date()
      // Formats the current date used send a request for timetable and notices later
      const TodayFormatted =
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

      const from = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() - 1)
      console.log(TodayFormatted)
      console.log(from)

      // var url = `https://newsapi.org/v2/everything?sources=abc-news&from=${TodayFormatted}&sortBy=popularity&apiKey=17c0da766ba347c89d094449504e3080`;
      let url = `https://newsapi.org/v2/everything?domains=abc.net.au&from=${from}&apiKey=17c0da766ba347c89d094449504e3080`

      function GetNews () {
        fetch(url)
          .then((result) => result.json())
          .then((response) => {
            if (response.code === 'rateLimited') {
              url += '%00'
              GetNews()
            } else {
              sendResponse({ news: response })
            }
          })
      }

      GetNews()

      return true
    }
  }
)

const DefaultValues = {
  onoff: true,
  animatedbk: false,
  lessonalert: false,
  notificationcollector: true,
  defaultmenuorder: [],
  menuitems: {},
  menuorder: [],
  subjectfilters: {},
  selectedColor: '#1a1a1a',
  DarkMode: true,
  shortcuts: [
    {
      name: 'YouTube',
      enabled: true
    },
    {
      name: 'Outlook',
      enabled: true
    },
    {
      name: 'Office',
      enabled: true
    },
    {
      name: 'Spotify',
      enabled: true
    },
    {
      name: 'Google',
      enabled: false
    },
    {
      name: 'DuckDuckGo',
      enabled: false
    },
    {
      name: 'Cool Math Games',
      enabled: false
    },
    {
      name: 'SACE',
      enabled: false
    },
    {
      name: 'Google Scholar',
      enabled: false
    },
    {
      name: 'Gmail',
      enabled: false
    },
    {
      name: 'Netflix',
      enabled: false
    }
  ],
  customshortcuts: []
}

function SetStorageValue (object) {
  for (const i in object) {
    browser.storage.local.set({ [i]: object[i] })
  }
}

function UpdateCurrentValues (details) {
  console.log(details)

  const result = browser.storage.local.get()
  function changeValues (items) {
    const CurrentValues = items

    const NewValue = Object.assign({}, DefaultValues, CurrentValues)

    function CheckInnerElement (element) {
      for (const i in element) {
        if (typeof element[i] === 'object') {
          if (typeof DefaultValues[i].length === 'undefined') {
            NewValue[i] = Object.assign({}, DefaultValues[i], CurrentValues[i])
          } else { // If the object is an array, turn it back after
            const length = DefaultValues[i].length
            NewValue[i] = Object.assign({}, DefaultValues[i], CurrentValues[i])
            const NewArray = []
            for (let j = 0; j < length; j++) {
              NewArray.push(NewValue[i][j])
            }
            NewValue[i] = NewArray
          }
        }
      }
    }
    CheckInnerElement(DefaultValues)

    if (items.customshortcuts) {
      NewValue.customshortcuts = items.customshortcuts
    }

    SetStorageValue(NewValue)
  }
  result.then(changeValues, onError)
}

browser.runtime.onInstalled.addListener(function (event) {
  browser.storage.local.remove(['justupdated'])
  UpdateCurrentValues()
  if (/* browser.runtime.getManifest().version > event.previousVersion || */ event.reason === 'install') {
    browser.storage.local.set({ justupdated: true })
  }
})
