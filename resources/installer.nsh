; Remove the startup entry written by app.setLoginItemSettings() on real uninstall
; (not during an in-place update, where the new version re-registers it).
!macro customUnInstall
  ${ifNot} ${isUpdated}
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "electron.app.${PRODUCT_NAME}"
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run" "electron.app.${PRODUCT_NAME}"
  ${endIf}
!macroend
