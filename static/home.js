//Screen Size Mechanism
let browserZoom = document.body.style.zoom = "100%";
theHeightofhtescreen = window.screen.height;
theWidthofhtescreen = window.screen.width; 
if (theHeightofhtescreen === 1050 && theWidthofhtescreen == 1680) {
  browserZoom = document.body.style.zoom = "100%";
} else if (theHeightofhtescreen === 800 && theWidthofhtescreen == 1280) {
  browserZoom = document.body.style.zoom = "67%";
} else if (theHeightofhtescreen === 1440 && theWidthofhtescreen == 2560) {
  browserZoom = document.body.style.zoom = "100%";
}else if(theHeightofhtescreen === 900 && theWidthofhtescreen === 1440){
  browserZoom = document.body.style.zoom = "67%";
}else if (theHeightofhtescreen === '' && theWidthofhtescreen === ''){
  browserZoom = document.body.style.zoom = "auto";
}else{
  browserZoom = document.body.style.zoom = "100%";
}

console.log("Height: ",theHeightofhtescreen);
console.log("Width: ",theWidthofhtescreen);


//Load and render paper
async function loadPapers(){
  const grid = document.getElementById('files-grid');
  const res = await fetch ('/papers');
  const papers = await res.json();

  grid.innerHTML = '';

  papers.forEach(papers => {
    const card = document.createElement('div');
    card.className = 'research-papers';
    card.innerHTML =`
    <div class="research-papers">
      <div class = "research-paper-information-paper">
        <img src = "static/${papers.cover}" alt="cover" id="research-paper-information-img">
      </div>
      <div class="research-paper-information">
        <div class="research-paper-information-title">
          ${papers.title}                    
        </div>
        <br>
        <div class="research-paper-information-author">
          by ${papers.author}
        </div>
        <br>
        <button class="downloadpdf-button" id="research-paper4-file">
          Download PDF
        </button>
      </div>
    </div>`;
    grid.appendChild(card);
  }); 
}

function downloadPaper(filename, title){
  const link = document.createElement('a');
  link.href= `/uploads/${filename}`
  link.download = title + '.pdf';
  link.click();
}

const modal = document.getElementById('upload-modal');
const uploadBtn = document.getElementById('file-upload-button');
const closeBtn = document.getElementById('close-modal');
const uploadForm = document.getElementById('file-upload-logic');
const statusEl = document.getElementById('upload-status');

uploadBtn.addEventListener('click', function(){
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', function(){
  modal.style.display = 'none';
  uploadForm.reset();
  statusEl.textContent = '';
});

uploadForm.addEventListener('submit', async (e)=> {
  e.preventDefault();

  const title = document.getElementById ('upload-title').value;
  const author = document.getElementById ('upload-author').value;
  const file = document.getElementById ('upload-file').files[0];

  if (!file) return;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('file', file);

  statusEl.textContent = 'Uploading...';

  try{
    const res = await fetch('/uploadfile/', {method: 'POST', body: formData});
    if (res.ok){
      statusEl.textContent = 'Upload Successful!';
      uploadForm.reset();
      setTimeout(() => {
        modal.style.display = 'none';
        statusEl.textcontent = '';
        loadPapers();
      },1000)} else{
        statusEl.textContent = 'Upload failed. Try again.';
      }
  }catch (err){
      statusEl.textContent = 'Error: ' + err.message;  
    }
});

loadPapers();


//Header
document.getElementById('profile-picture-button').addEventListener("click", function(){
  const link = document.createElement("a");
  link.href = "login.html";
  link.target = "_blank";
  link.click();
});

const form = document.getElementById('file-upload-logic');

uploadBtn.addEventListener('click', () =>{
  modal.style.display= 'flex';
})


//Account
let account = ''; 
let profileButton = '';
if (account === true){
  profileButton = document.createElement("img");
}else if (account === false){
  profileButton = document.createElement("img");
};

//Menu
document.getElementById('forms-button').addEventListener("click", function(){
const link = document.createElement("a");
link.href = "forms.html";
link.click();
})
document.getElementById('trending-button').addEventListener("click", function(){
const link = document.createElement("a");
link.href = "trending.html";
link.click();
})
