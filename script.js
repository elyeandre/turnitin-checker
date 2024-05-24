async function checkPlagiarism() {
  const textToCheck = document.getElementById('inputText').value;
  const proxyUrl = 'https://simple-proxy.mayor.workers.dev/';
  const url = 'https://papersowl.com/plagiarism-checker-send-data';
  const checkButton = document.querySelector('.button');
  const pasteButton = document.getElementById('pasteButton');
  const clearButton = document.getElementById('clearButton');
  const inputText = document.getElementById('inputText');
  let result = null;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  if (!textToCheck.trim()) {
    displayError({
      message: 'Input text cannot be empty. Please enter some text to check.'
    });
    return;
  }
  checkButton.classList.add('button--loading');
  checkButton.disabled = true;
  pasteButton.disabled = true;
  clearButton.disabled = true;
  inputText.disabled = true;
  cookies = {
    PHPSESSID: 'qjc72e3vvacbtn4jd1af1k5qn1',
    first_interaction_user:
      '{"referrer":"https://www.google.com/","internal_url":"/free-plagiarism-checker","utm_source":null,"utm_medium":null,"utm_campaign":null,"utm_content":null,"utm_term":null,"gclid":null,"msclkid":null,"adgroupid":null,"targetid":null,"appsflyer_id":null,"appsflyer_cuid":null,"cta_btn":null}',
    first_interaction_order:
      '{"referrer":"https://www.google.com/","internal_url":"/free-plagiarism-checker","utm_source":null,"utm_medium":null,"utm_campaign":null,"utm_content":null,"utm_term":null,"gclid":null,"msclkid":null,"adgroupid":null,"targetid":null,"appsflyer_id":null,"appsflyer_cuid":null,"cta_btn":null}',
    affiliate_user:
      'a:3:{s:9:"affiliate";s:9:"papersowl";s:6:"medium";s:9:"papersowl";s:8:"campaign";s:9:"papersowl";}',
    sbjs_migrations: '1418474375998=1',
    sbjs_current_add:
      'fd=2022-05-24 19:01:22|||ep=https://papersowl.com/free-plagiarism-checker|||rf=https://www.google.com/',
    sbjs_first_add:
      'fd=2022-05-24 19:01:22|||ep=https://papersowl.com/free-plagiarism-checker|||rf=https://www.google.com/',
    sbjs_current: 'typ=organic|||src=google|||mdm=organic|||cmp=(none)|||cnt=(none)|||trm=(none)',
    sbjs_first: 'typ=organic|||src=google|||mdm=organic|||cmp=(none)|||cnt=(none)|||trm=(none)',
    sbjs_udata:
      'vst=1|||uip=(none)|||uag=Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
    sbjs_session: 'pgs=1|||cpg=https://papersowl.com/free-plagiarism-checker',
    _ga_788D7MTZB4: 'GS1.1.1653411683.1.0.1653411683.0',
    _ga: 'GA1.1.1828699233.1653411683',
    trustedsite_visit: '1',
    trustedsite_tm_float_seen: '1',
    AppleBannercookie_hide_header_banner: '1',
    COOKIE_PLAGIARISM_CHECKER_TERMS: '1',
    plagiarism_checker_progress_state: '1'
  };
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0',
    Accept: '*/*',
    'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate',
    Referer: 'https://papersowl.com/free-plagiarism-checker',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    Origin: 'https://papersowl.com',
    Dnt: '1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'same-origin',
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    Te: 'trailers',
    Connection: 'close',
    Cookies: Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
  };
  const data = new URLSearchParams({
    is_free: 'false',
    plagchecker_locale: 'en',
    product_paper_type: '1',
    title: '',
    text: textToCheck
  });
  try {
    const response = await fetch(`${proxyUrl}?destination=${url}`, {
      method: 'POST',
      headers: headers,
      body: data
    });
    result = await response.json();
    displayResult(result, textToCheck);
  } catch (error) {
    checkButton.classList.remove('button--loading');
    console.error('Error:', error);
    displayError(result);
  } finally {
    checkButton.disabled = false;
    checkButton.classList.remove('button--loading');
    pasteButton.disabled = false;
    clearButton.disabled = false;
    inputText.disabled = false;
  }
}

function displayResult(result, text) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<h2>Results</h2><p><strong>Word count:</strong>${
    result.words_count
  }</p><p><strong>Turnitin index:</strong>${
    100 - parseFloat(result.percent)
  }</p><p><strong>Matches:</strong></p><div id="matches"class="match-container"></div>`;
  const matchesDiv = document.getElementById('matches');
  result.matches.forEach((match, index) => {
    const highlightedText = visualizeHighlights(text, match.highlight);
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match');
    matchDiv.innerHTML = `<p><strong>URL:</strong><a href="${match.url}"target="_blank">${match.url}</a></p><p><strong>Percent:</strong>${match.percent}%</p><p><strong>Highlighted Text:</strong></p><pre>${highlightedText}</pre>`;
    setTimeout(() => {
      matchesDiv.appendChild(matchDiv);
    }, index * 100);
  });
}

function visualizeHighlights(text, highlights) {
  let highlightedText = text.split('');
  highlights
    .sort((a, b) => b[0] - a[0])
    .forEach(([start, end]) => {
      start = parseInt(start);
      end = parseInt(end);
      highlightedText.splice(end + 1, 0, '</span>');
      highlightedText.splice(start, 0, '<span class="highlight">');
    });
  return highlightedText.join('');
}

function displayError(result) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';
  const errorMessage =
    result?.message || result?.error || 'An error occurred while checking for plagiarism. Please try again later.';
  const modal = document.getElementById('errorModal');
  modal.style.display = 'flex';
  const errorText = document.getElementById('errorText');
  errorText.innerHTML = errorMessage;
}

function closeModal() {
  const modal = document.getElementById('errorModal');
  modal.style.display = 'none';
}

function clearTextArea() {
  document.getElementById('inputText').value = '';
}
const paste = document.getElementById('pasteButton');
paste.addEventListener('click', () => {
  navigator.clipboard.readText().then((clipText) => (document.getElementById('inputText').value = clipText));
});
