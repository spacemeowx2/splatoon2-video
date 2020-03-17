## Install OpenCV

choco install OpenCV

## Install node dependencies

PowerShell:

```powershell
$env:OPENCV4NODEJS_DISABLE_AUTOBUILD=1
$env:OPENCV_INCLUDE_DIR="C:\tools\opencv\build\include"
$env:OPENCV_LIB_DIR="C:\tools\opencv\build\x64\vc15\lib"
$env:OPENCV_BIN_DIR="C:\tools\opencv\build\x64\vc15\bin"
yarn
```

## Usage

```
npm start switch-video-folder [out-folder]
```

out-folder is optional, default to ./out/
