# mortar devtools

One project to build them all, and in the darkness distribute and bind them to your devtools.

## I'm in! How to?


````bash
git clone https://github.com/sole/mortar-devtools.git
cd mortar-devtools
node build.js
````

## Pending stuff

- Generate JSON for devtools
  - Where does the data for each entry come from? title, description
    - Each template folder?
- Probably refactor common functions that will arise as more templates are added
- Things to test
  - For each template in templates/ there must be a generated ZIP file
  - Each ZIP must contain a valid project
    - how can we say something is "a valid project"?
      - It can be unzipped and has > 0 files
      - MD5?
- How do we get this into a public server?
  - check in the dist files
  - or make a task to upload to some FTP
    - then also need the MD5
