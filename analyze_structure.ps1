function Get-FolderStructure {
    param (
        [string]$Path,
        [string]$Indent = ""
    )

    $Items = Get-ChildItem -Path $Path

    foreach ($Item in $Items) {
        Write-Output ("$Indent|-- " + $Item.Name)

        if ($Item.PSIsContainer) {
            Get-FolderStructure -Path $Item.FullName -Indent ("$Indent    ")
        }
    }
}

$FolderPath = "src\"  # Update this with the path to your 'app' folder
$OutputFile = "code_structure.txt"

Get-FolderStructure -Path $FolderPath | Out-File -FilePath $OutputFile
