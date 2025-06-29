#!/bin/bash

# Create monsters directory if it doesn't exist
mkdir -p monsters

# List of all unique monsters from the tournament
monsters=(
    "Antaeus"
    "Asmodeus"
    "Dispater"
    "Lom_Lobon"
    "Gloorx_Vloq"
    "Ereshkigal"
    "Murray"
    "Mennas"
    "Asterion"
    "Jorgrun"
    "Xak'krixis"
    "Xtahua"
    "Dissolution"
    "Khufu"
    "Louise"
    "Sojobo"
    "Terence"
    "Maurice"
    "Sigmund"
    "Zenata"
    "Duvessa"
    "Sonja"
    "Dowan"
    "Harold"
    "Grum"
    "Pikel"
    "Blorkula_the_Orcula"
)

# Download each monster tile
for monster in "${monsters[@]}"
do
    # Replace spaces with underscores for URL
    url_monster="${monster// /_}"
    
    echo "Downloading $monster..."
    wget -q -O "monsters/${monster}.png" "https://crawl.develz.org/info/tile.php?q=${url_monster}"
    
    # Check if download was successful
    if [ $? -eq 0 ]; then
        echo "✓ Downloaded $monster"
    else
        echo "✗ Failed to download $monster"
    fi
done

echo "Download complete!"