const app = document.querySelector('.app');
const randomButton = document.querySelector('#random');
const searchButton = document.querySelector('#search');
const main = document.querySelector('main');
let searchForm = '';

function getRandomWiki() {
  let title = '';
  let text = '';
  fetch(`https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let newObject = {};
        for (let i in data.query.pages) {
          newObject = {
            text: data.query.pages[i].extract,
            url: encodeURI(`https://en.wikipedia.org/wiki/${data.query.pages[i].title}`),
            title: data.query.pages[i].title
          }
        }
        console.log(newObject);

        app.innerHTML = `
          <div class="fadeIn">
            <h2>${newObject.title}</h2>
            <div>${newObject.text}</div>
            <a class="button" role="button" href="${newObject.url}" rel="noopener noreferrer" target="_blank">Read more on Wikipedia</a>
          </div>
        `;
      })
      .catch(() => {
        console.log('Error from Wiki API');
        app.innerHTML = "<p>Sorry, not possible to get data from Wikipedia, please try again later</p>";
      });
}

function searchLoader() {
  app.innerHTML = `
    <div class="fadeIn">
      <form class="searchForm">
        <input type="search" class="searchInput" placeholder="Search Wikipedia..." name="search">
        <button type="submit"><i class="fa fa-search" style="font-size:30px"></i></button>
      </form>
    </div>
    <ul class="container"></ul>
  `;

  searchForm = document.querySelector('.searchForm');
  searchForm.addEventListener('submit', searchWiki);
}

function searchWiki(e) {
  e.preventDefault();
  console.log(e);

  const input = e.srcElement['0'].value.trim();
  console.log(input);

  let container = document.querySelector('.container');
  container.innerHTML = '';
  let timeout = 100;

  const endpoint = encodeURI(`https://en.wikipedia.org/w/api.php?&action=query&list=search&prop=extracts&exchars=100&format=json&origin=*&srlimit=10&srsearch=${input}`);

  fetch(endpoint)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let dataArray = [];

        data.query.search.forEach((item) => {
          timeout += 150;
          const newObject = {
            text: item.snippet,
            url: encodeURI(`https://en.wikipedia.org/wiki/${item.title}`),
            title: item.title,
            timeout: timeout
          };
          dataArray.push(newObject);
        });
        console.log(dataArray);
        dataArray.forEach(item => {
          const article = document.createElement('li');
          article.classList.add('slideDown');

          const heading = document.createElement('h2');
          heading.innerHTML = item.title;
          article.append(heading);

          const text = document.createElement('p');
          text.innerHTML = `${item.text}...`;
          article.append(text);

          const button = document.createElement('a');
          button.innerHTML = 'Read more';
          button.setAttribute("role", "button");
          button.setAttribute("aria-label", "view more on Wikipedia");
          button.setAttribute("rel", "noopener noreferrer");
          button.setAttribute("target", "_blank");
          button.href = item.url;

          article.append(button);

          setTimeout(function() {
            container.append(article);
          }, item.timeout);
        });
      })
      .catch(() => {
        console.log('Error from Wiki API');
        app.innerHTML = "<p>Sorry, not possible to get data from Wikipedia, please try again later</p>";
      });
}

function createContainer() {
  const container = document.createElement('ul');
  container.classList.add('container');
  main.append(container);
}

randomButton.addEventListener('click', getRandomWiki);
searchButton.addEventListener('click', searchLoader);
