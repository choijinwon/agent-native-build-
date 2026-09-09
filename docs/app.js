const events = [...document.querySelectorAll('.event')];
const replayButton = document.querySelector('#replay');
let replayTimer;

function runDemo() {
  clearInterval(replayTimer);
  events.forEach(event => event.classList.remove('active', 'done'));
  let index = 0;
  events[0].classList.add('active');
  replayTimer = setInterval(() => {
    events[index].classList.remove('active');
    events[index].classList.add('done');
    index += 1;
    if (index >= events.length) {
      clearInterval(replayTimer);
      return;
    }
    events[index].classList.add('active');
  }, 750);
}

replayButton.addEventListener('click', runDemo);

const command = `git clone https://github.com/choijinwon/agent-native-build-.git
cd agent-native-build-
python3 -m agent_native`;

document.querySelector('#copy-code').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(command);
    const toast = document.querySelector('#toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  } catch (_) {
    document.querySelector('#copy-code').textContent = '복사 실패';
  }
});

const observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) runDemo();
}, { threshold: .4 });
observer.observe(document.querySelector('#demo'));

