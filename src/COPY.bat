erase "D:\RAGEMP\server-files\client_packages\dist_UI\"
if not exist "D:\RAGEMP\server-files\client_packages\dist_UI\" mkdir "D:\RAGEMP\server-files\client_packages\dist_UI\"
xcopy "D:\RAGEMP\server-files\src\client\project\dist_UI" "D:\RAGEMP\server-files\client_packages\dist_UI\" /S /E

erase "D:\RAGEMP\server-files\client_packages\modules\"
if not exist "D:\RAGEMP\server-files\client_packages\modules\" mkdir "D:\RAGEMP\server-files\client_packages\modules\"
xcopy "D:\RAGEMP\server-files\src\client\project\modules" "D:\RAGEMP\server-files\client_packages\modules\" /S /E