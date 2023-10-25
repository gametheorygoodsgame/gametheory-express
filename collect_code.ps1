# Output file
$outputFile = "E:\Benutzer\eiker\Dokumente\GitHub\gametheory-express\GameTheory-Express\code_out.txt"

# Remove the output file if it exists (to overwrite it)
if (Test-Path -Path $outputFile) {
    Remove-Item -Path $outputFile
}

# Define the directories to search recursively with absolute paths
$directories = @(
    "E:\Benutzer\eiker\Dokumente\GitHub\gametheory-express\GameTheory-Express\src\common",
    "E:\Benutzer\eiker\Dokumente\GitHub\gametheory-express\GameTheory-Express\src\games"
)

# Iterate over specified directories and their subdirectories for .ts files
foreach ($directory in $directories) {
    Get-ChildItem -Path $directory -Recurse -Filter *.ts | ForEach-Object {
        Add-Content -Path $outputFile -Value "// $($_.FullName)"
        Get-Content -Path $_.FullName | Add-Content -Path $outputFile
    }
}

# Display a message to indicate completion
Write-Host "Code has been collected and written to $outputFile"
