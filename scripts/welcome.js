/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./scripts/leetcode/util.js
/** Enum for languages supported by LeetCode. */
const languages = Object.freeze({
  C: '.c',
  'C++': '.cpp',
  'C#': '.cs',
  Dart: '.dart',
  Elixir: '.ex',
  Erlang: '.erl',
  Go: '.go',
  Java: '.java',
  JavaScript: '.js',
  Javascript: '.js',
  Kotlin: '.kt',
  MySQL: '.sql',
  'MS SQL Server': '.sql',
  Oracle: '.sql',
  Pandas: '.py',
  PHP: '.php',
  Python: '.py',
  Python3: '.py',
  Racket: '.rkt',
  Ruby: '.rb',
  Rust: '.rs',
  Scala: '.scala',
  Swift: '.swift',
  TypeScript: '.ts',
});

/** @enum */
const DIFFICULTY = Object.freeze({
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  UNKNOWN: 'Unknown',
});

class GitItDoneError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GitItDoneErr';
  }
}

function isEmptyObject(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

function assert(truthy, msg) {
  if (!truthy) {
    throw new GitItDoneError(msg);
  }
}

/**
 * Returns a function that can be immediately invoked but will start
 * a timeout of 'wait' milliseconds before it can be called again.
 * @param {Function} func to be called after wait
 * @param {number} wait time in ms
 * @param {boolean} invokeBeforeTimeout true if you want to invoke func before waiting
 * @returns {Function}
 */
function debounce(func, wait, invokeBeforeTimeout) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!invokeBeforeTimeout) func.apply(context, args);
    };
    const callNow = invokeBeforeTimeout && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Delays the execution of a function by the specified time (in milliseconds)
 * and then executes the function with the provided arguments.
 *
 * @param {Function} func - The function to be executed after the delay.
 * @param {number} wait - The number of milliseconds to wait before executing the function.
 * @param {...*} [args] - Additional arguments to pass to the function when it is called.
 * @returns {Promise<*>} A promise that resolves with the result of the function execution.
 */
function delay(func, wait, ...args) {
  return new Promise(resolve => setTimeout(() => resolve(func(...args)), wait));
}

/**
 *
 * @returns {chrome | browser} namespace of browser extension api
 */
function getBrowser() {
  if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
    return chrome;
  } else if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') {
    return browser;
  } else {
    throw new GitItDoneError('BrowserNotSupported');
  }
}

/**
 * Returns the difficulty in PascalCase for a given difficulty
 * @param {string} difficulty - The difficulty level as a string: "easy", "medium", "hard", etc.
 * @returns {string} - The difficulty level in PascalCase: "Easy", "Medium", or "Hard" or "Unknown" for unrecognized values.
 */
function getDifficulty(difficulty) {
  difficulty &&= difficulty.toUpperCase().trim();
  return DIFFICULTY[difficulty] ?? DIFFICULTY.UNKNOWN;
}

/**
 * Checks if an HTML Collection exists and has elements
 * @param {HTMLCollectionOf<Element>} elem
 * @returns
 */
function checkElem(elem) {
  return elem && elem.length > 0;
}

/** @param {string} string @returns {string} problem slug, e.g. 0001-two-sum */
function convertToSlug(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function addLeadingZeros(title) {
  const maxTitlePrefixLength = 4;
  var len = title.split('-')[0].length;
  if (len < maxTitlePrefixLength) {
    return '0'.repeat(4 - len) + title;
  }
  return title;
}

function formatStats(time, timePercentile, space, spacePercentile) {
  return `Time: ${time} (${timePercentile}%), Space: ${space} (${spacePercentile}%) - GitItDone`;
}

function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function mergeDeep(target, source) {
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) {
        Object.assign(target, { [key]: {} });
      }
      mergeDeep(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
}

function mergeStats(obj1, obj2) {
  function countDifficulties(shas) {
    const difficulties = { easy: 0, medium: 0, hard: 0, solved: 0 };
    for (const problem in shas) {
      if ('difficulty' in shas[problem]) {
        const difficulty = shas[problem].difficulty;
        if (difficulty in difficulties) {
          difficulties[difficulty]++;
        }
      }
    }
    for (let value of Object.values(difficulties)) {
      difficulties.solved += value;
    }
    return difficulties;
  }

  const merged = {};
  mergeDeep(merged, obj1);
  mergeDeep(merged, obj2);

  const shas = merged.shas || {};
  const difficulties = countDifficulties(shas);

  merged.easy = difficulties.easy;
  merged.medium = difficulties.medium;
  merged.hard = difficulties.hard;
  merged.solved = difficulties.solved;

  return merged;
}



;// CONCATENATED MODULE: ./scripts/welcome.js


const api = getBrowser();

const welcome_option = () => {
  return $('#type').val();
};

const repositoryName = () => {
  return $('#name').val().trim();
};

const createRepoDescription =
  'A collection of LeetCode questions to ace the coding interview! - Created using [GitItDone](https://github.com/anujlunawat/GitItDone)';

/* Sync's local storage with persistent stats and returns the pulled stats. Currently only syncs when we install, or unlink then relink */
const syncStats = async () => {
  let { gititdone_hook, gititdone_token, sync_stats, stats } = await api.storage.local.get([
    'gititdone_token',
    'gititdone_hook',
    'sync_stats',
    'stats',
  ]);

  if (sync_stats === false) {
    console.log('Persistent stats already synced!');
    return;
  }

  const URL = `https://api.github.com/repos/${gititdone_hook}/contents/stats.json`;

  let options = {
    method: 'GET',
    headers: {
      Authorization: `token ${gititdone_token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  };

  let resp = await fetch(URL, options);
  if (!resp.ok && resp.status == 404) {
    await api.storage.local.set({ sync_stats: false });
    console.log('No stats found; starting fresh');
    return {};
  }
  let data = await resp.json();
  let pStatsJson = decodeURIComponent(escape(atob(data.content)));
  let pStats = await JSON.parse(pStatsJson);

  api.storage.local.set({ stats: pStats.leetcode, sync_stats: false }, () =>
    console.log(`Successfully synced local stats with GitHub stats`)
  );

  // emulate the nested return obj of api.storage.local.get('stats')
  return { stats: pStats.leetcode };
};

const getCreateErrorString = (statusCode, name) => {
  /* Status codes for creating of repo */
  const errorStrings = {
    304: `Error creating ${name} - Unable to modify repository. Try again later!`,
    400: `Error creating ${name} - Bad POST request, make sure you're not overriding any existing scripts`,
    401: `Error creating ${name} - Unauthorized access to repo. Try again later!`,
    403: `Error creating ${name} - Forbidden access to repository. Try again later!`,
    422: `Error creating ${name} - Unprocessable Entity. Repository may have already been created. Try Linking instead (select 2nd option).`,
  };
  return errorStrings[statusCode];
};

const handleRepoCreateError = (statusCode, name) => {
  $('#success').hide();
  $('#error').text(getCreateErrorString(statusCode, name));
  $('#error').show();
};

const createRepo = async (token, name) => {
  const AUTHENTICATION_URL = 'https://api.github.com/user/repos';
  let data = {
    name,
    private: true,
    auto_init: true,
    description: createRepoDescription,
  };

  const options = {
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(data),
  };

  let res = await fetch(AUTHENTICATION_URL, options);
  if (!res.ok) {
    return handleRepoCreateError(res.status, name);
  }
  res = await res.json();

  /* Set Repo Hook, and set mode type to commit */
  api.storage.local.set({ mode_type: 'commit', gititdone_hook: res.full_name });
  await api.storage.local.remove('stats');
  $('#error').hide();
  $('#success').html(
    `Successfully created <a target="blank" href="${res.html_url}">${name}</a>. Start <a href="http://leetcode.com">LeetCoding</a>!`
  );
  $('#success').show();
  $('#unlink').show();
  /* Show new layout */
  document.getElementById('hook_mode').style.display = 'none';
  document.getElementById('commit_mode').style.display = 'inherit';
};

const getLinkErrorString = (statusCode, name) => {
  /* Status codes for linking repo */
  const errorStrings = {
    301: `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to Git. <br> This repository has been moved permenantly. Try creating a new one.`,
    403: `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to GitItDone. <br> Forbidden action. Please make sure you have the right access to this repository.`,
    404: `Error linking <a target="blank" href="${`https://github.com/${name}`}">${name}</a> to GitItDone. <br> Resource not found. Make sure you enter the right repository name.`,
  };
  return errorStrings[statusCode];
};
/* Status codes for linking of repo */
const handleLinkRepoError = (statusCode, name) => {
  $('#success').hide();
  $('#error').html(getLinkErrorString(statusCode, name));
  $('#error').show();
  $('#unlink').show();
};

/* 
    Method for linking hook with an existing repository 
    Steps:
    1. Check if existing repository exists and the user has write access to it.
    2. Link Hook to it (chrome Storage).
*/
const linkRepo = (token, name) => {
  // Remove duplicate username if present
  const repoPath = name.includes('/') ? name : `${username}/${name}`;
  const AUTHENTICATION_URL = `https://api.github.com/repos/${repoPath}`;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState !== 4) {
      return;
    }
    if (xhr.status !== 200) {
      handleLinkRepoError(xhr.status, repoPath);
      api.storage.local.set({ mode_type: 'hook', gititdone_hook: null }, () => {
        console.log(`Error linking ${repoPath} to GitItDone`);
        console.log('Defaulted repo hook to NONE');
      });

      document.getElementById('hook_mode').style.display = 'inherit';
      document.getElementById('commit_mode').style.display = 'none';
      return;
    }

    const res = JSON.parse(xhr.responseText);
    api.storage.local.set(
      { mode_type: 'commit', repo: res.html_url, gititdone_hook: res.full_name },
      () => {
        $('#error').hide();
        $('#success').html(
          `Successfully linked <a target="blank" href="${res.html_url}">${name}</a> to GitItDone. Start <a href="http://leetcode.com">LeetCoding</a> now!`
        );
        $('#success').show();
        $('#unlink').show();
        console.log('Successfully set new repo hook');
      }
    );
    /* Get Persistent Stats or Create new stats */
    api.storage.local
      .get('sync_stats')
      .then(data => (data?.sync_stats ? syncStats() : api.storage.local.get('stats')))
      .then(data => {
        /* Get problems solved count */
        const stats = data?.stats;
        $('#p_solved').text(stats?.solved ?? 0);
        $('#p_solved_easy').text(stats?.easy ?? 0);
        $('#p_solved_medium').text(stats?.medium ?? 0);
        $('#p_solved_hard').text(stats?.hard ?? 0);
      });

    /* Hide accordingly */
    document.getElementById('hook_mode').style.display = 'none';
    document.getElementById('commit_mode').style.display = 'inherit';
  });

  xhr.open('GET', AUTHENTICATION_URL, true);
  xhr.setRequestHeader('Authorization', `token ${token}`);
  xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
  xhr.send();
};

const unlinkRepo = () => {
  /* Reset mode type to hook, stats to null */
  api.storage.local.set(
    { mode_type: 'hook', gititdone_hook: null, sync_stats: true, stats: null },
    () => {
      console.log(`Unlinked repo`);
      console.log('Cleared local stats');
    }
  );

  /* Hide accordingly */
  document.getElementById('hook_mode').style.display = 'inherit';
  document.getElementById('commit_mode').style.display = 'none';
};

const fetchRepositories = async (token) => {
  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};

const displayRepositories = (repos) => {
  const repoSelect = $('#repo-select');
  repoSelect.empty().append('<option value="">Select a Repository</option>');
  
  repos.forEach(repo => {
    // Use only the repo name, not the full path
    const option = $('<option>')
      .val(repo.name)
      .text(repo.name);
    repoSelect.append(option);
  });
};

const handleRepoSelection = (repoName) => {
  $('#name').val(repoName);
  $('#hook_button').prop('disabled', !repoName);
};

// Modify the existing type change handler
$('#type').on('change', async function() {
  const selectedType = $(this).val();
  const nameInput = $('#name');
  const repoSelect = $('#repo-select');
  
  if (selectedType === 'link') {
    const { gititdone_token } = await api.storage.local.get(['gititdone_token']);
    if (gititdone_token) {
      const repos = await fetchRepositories(gititdone_token);
      displayRepositories(repos);
      repoSelect.show();
      nameInput.hide();
      nameInput.attr('placeholder', 'Select a repository from the dropdown');
    }
  } else {
    repoSelect.hide();
    nameInput.show();
    nameInput.attr('placeholder', 'Repository Name');
  }
});

// Add change handler for repository selection
$('#repo-select').on('change', function() {
  const repoName = $(this).val();
  handleRepoSelection(repoName);
});

$('#hook_button').on('click', () => {
  /* on click should generate: 1) option 2) repository name */
  if (!welcome_option()) {
    $('#error').text(
      'No option selected - Pick an option from dropdown menu below that best suits you!'
    );
    $('#error').show();
  } else if (!repositoryName()) {
    $('#error').text('No repository name added - Enter the name of your repository!');
    $('#name').focus();
    $('#error').show();
  } else {
    $('#error').hide();
    $('#success').text('Attempting to create Hook... Please wait.');
    $('#success').show();

    /* 
      Perform processing
      - step 1: Check if current stage === hook.
      - step 2: store repo name as repoName in chrome storage.
      - step 3: if (1), POST request to repoName (iff option = create new repo) ; else display error message.
      - step 4: if proceed from 3, hide hook_mode and display commit_mode (show stats e.g: files pushed/questions-solved/leaderboard)
    */
    api.storage.local.get('gititdone_token', data => {
      const token = data.gititdone_token;
      if (token === null || token === undefined) {
        /* Not authorized yet. */
        $('#error').text(
          'Authorization error - Grant GitItDone access to your GitHub account to continue (launch extension to proceed)'
        );
        $('#error').show();
        $('#success').hide();
      } else if (welcome_option() === 'new') {
        createRepo(token, repositoryName());
      } else {
        api.storage.local.get('gititdone_username', data2 => {
          const username = data2.gititdone_username;
          if (!username) {
            /* Improper authorization. */
            $('#error').text(
              'Improper Authorization error - Grant GitItDone access to your GitHub account to continue (launch extension to proceed)'
            );
            $('#error').show();
            $('#success').hide();
          } else {
            linkRepo(token, `${username}/${repositoryName()}`, false);
          }
        });
      }
    });
  }
});

$('#unlink a').on('click', () => {
  unlinkRepo();
  $('#unlink').hide();
  $('#success').text('Successfully unlinked your current git repo. Please create/link a new hook.');
});

/* Detect mode type */
api.storage.local.get('mode_type', data => {
  const mode = data.mode_type;

  if (mode && mode === 'commit') {
    /* Check if still access to repo */
    api.storage.local.get('gititdone_token', data2 => {
      const token = data2.gititdone_token;
      if (token === null || token === undefined) {
        /* Not authorized yet. */
        $('#error').text(
          'Authorization error - Grant GitItDone access to your GitHub account to continue (click GitItDone extension on the top right to proceed)'
        );
        $('#error').show();
        $('#success').hide();
        /* Hide accordingly */
        document.getElementById('hook_mode').style.display = 'inherit';
        document.getElementById('commit_mode').style.display = 'none';
      } else {
        /* Get access to repo */
        api.storage.local.get('gititdone_hook', repoName => {
          const hook = repoName.gititdone_hook;
          if (!hook) {
            /* Not authorized yet. */
            $('#error').text(
              'Improper Authorization error - Grant GitItDone access to your GitHub account to continue (click GitItDone extension on the top right to proceed)'
            );
            $('#error').show();
            $('#success').hide();
            /* Hide accordingly */
            document.getElementById('hook_mode').style.display = 'inherit';
            document.getElementById('commit_mode').style.display = 'none';
          } else {
            /* Username exists, at least in storage. Confirm this */
            linkRepo(token, hook);
          }
        });
      }
    });

    document.getElementById('hook_mode').style.display = 'none';
    document.getElementById('commit_mode').style.display = 'inherit';
  } else {
    document.getElementById('hook_mode').style.display = 'inherit';
    document.getElementById('commit_mode').style.display = 'none';
  }
});

/******/ })()
;