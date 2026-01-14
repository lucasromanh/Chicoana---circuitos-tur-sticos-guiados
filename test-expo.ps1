try {
    npx expo start 2>&1 | Tee-Object -FilePath "expo-error.log"
} catch {
    $_ | Out-File -FilePath "expo-error.log" -Append
}
