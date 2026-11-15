<div align="center">

<a href="https://1vcian.me"><img src="assets/banner.webp" width="100%" alt="Lucian Medrihan, software engineer in Rome, Italy. Code that actually ships, from satellite imagery pipelines to the games in your pocket."></a>

<a href="https://1vcian.me"><img src="assets/buttons/site.svg" height="42" alt="Website: 1vcian.me"></a>
<a href="https://linkedin.com/in/lume"><img src="assets/buttons/linkedin.svg" height="42" alt="LinkedIn"></a>
<a href="mailto:medrihanlucian@gmail.com"><img src="assets/buttons/email.svg" height="42" alt="Email"></a>
<a href="https://1vcian.me/Portfolio/resume.pdf"><img src="assets/buttons/resume.svg" height="42" alt="Résumé"></a>
<a href="https://github.com/1vcian/npx-card"><img src="assets/buttons/card.svg" height="42" alt="My card in your terminal: npx 1vcian"></a>

<a href="https://im.center/1vcian"><img src="https://im.center/b/1vcian.svg" alt="1vcian on im.center" height="36"></a>

<img src="https://komarev.com/ghpvc/?username=1vcian&label=profile+views&color=2f6fed&style=flat-square" alt="Profile views">

</div>

<h2 align="left">
  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28" height="28" alt="">
  Hi, I'm Lucian
</h2>

A software engineer in Rome who likes two things: code that actually ships, and finding out how things break.

- **By day** I build GIS platforms and machine learning on satellite imagery, the kind that has to hold up in production.
- **Off the clock** I hunt bugs, because I enjoy it. A lot of vulnerabilities found and reported, several of them rated CVSS 10.
- **For fun** I build the ideas I can't leave alone: games on the App Store and Google Play, open-source tools that grew their own communities, even an emulator.
- **It started at 12**, poking at things with BackTrack. That became a degree in Computer and Automation Engineering at Sapienza and a CTF team I co-founded.

<h2 align="left">
  <img src="https://media2.giphy.com/media/QssGEmpkyEOhBCb7e1/giphy.gif?cid=ecf05e47a0n3gi1bfqntqmob8g9aid1oyj2wr3ds3mg700bl&rid=giphy.gif" width="20" height="20" alt="">
  Toolbox
</h2>

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,ts,react,angular,nodejs,fastapi,flask,tailwind,threejs&perline=9" alt="Python, TypeScript, React, Angular, Node.js, FastAPI, Flask, Tailwind CSS, three.js"><br>
  <img src="https://skillicons.dev/icons?i=kotlin,rust,cpp,aws,gcp,docker,linux,firebase,githubactions&perline=9" alt="Kotlin, Rust, C++, AWS, Google Cloud, Docker, Linux, Firebase, GitHub Actions">
</p>

<h2 align="left">
  <img src="https://media2.giphy.com/media/QssGEmpkyEOhBCb7e1/giphy.gif?cid=ecf05e47a0n3gi1bfqntqmob8g9aid1oyj2wr3ds3mg700bl&rid=giphy.gif" width="20" height="20" alt="">
  Capture the flag
</h2>

There is a flag somewhere on this machine, and you are logged in as `guest`. Click a command to run it.

<details>
<summary><code>$ sudo cat /root/flag.txt</code></summary>

```console
[sudo] password for guest:
guest is not in the sudoers file. This incident will be reported.
```

Bold. Try something quieter.

</details>

<details>
<summary><code>$ ls -la</code></summary>

```console
total 20
drwxr-x--- 2 guest guest 4096 Nov 15 16:20 .
drwxr-xr-x 4 root  root  4096 Nov 15 09:02 ..
-rw------- 1 guest guest  214 Nov 15 16:19 .bash_history
-rwx------ 1 root  root   512 Nov 14 23:40 backup.sh
-rw-r--r-- 1 guest guest   61 Nov 14 23:48 notes.txt
```

Three files. One of them is more talkative than it should be.

<details>
<summary><code>$ ./backup.sh</code></summary>

```console
bash: ./backup.sh: Permission denied
```

It belongs to root, and you are not root. Yet.

</details>

<details>
<summary><code>$ cat notes.txt</code></summary>

```console
TODO: stop typing passwords before the prompt asks for them
```

A note to self. Interesting thing to need a note about.

</details>

<details>
<summary><code>$ cat .bash_history</code></summary>

```console
cd ~/projects
git pull
su lucian
correct-horse-battery-staple
ls -la
```

Line four is not a command. Somebody typed a password a moment too early, and the shell wrote it down.

<details>
<summary><code>$ history -c</code></summary>

```console
guest@1vcian:~$
```

Tidy, but too late: you have already read it.

</details>

<details>
<summary><code>$ su lucian</code></summary>

```console
Password: ****************************
lucian@1vcian:~$ cat flag.txt
flag{th3_sh3ll_r3m3mb3rs_3v3ryth1ng}
```

**You are in.** That is most of the job, really: look where nobody thought to clean up.

Send me the flag at [medrihanlucian@gmail.com](mailto:medrihanlucian@gmail.com?subject=flag%7Bth3_sh3ll_r3m3mb3rs_3v3ryth1ng%7D) and say hi. And if reading the raw README was your first idea, even better: we would get along.

</details>

</details>

</details>

<details>
<summary><code>$ rm -rf /</code></summary>

```console
rm: it is dangerous to operate recursively on '/'
rm: use --no-preserve-root to override this failsafe
```

And that is why you are `guest`.

</details>
