#!/bin/bash

echo "Starting search and replace process..."

# Find all files containing the pattern
find . -type f -exec grep -l "https://www\.deepwave\.org/wp-content/uploads/" {} \; | while read -r file; do
    echo "Processing file: $file"
    
    # Extract all matching URLs from the file
    grep -o "https://www\.deepwave\.org/wp-content/uploads/[^ \"'<>)]*" "$file" | while read -r url; do
        echo "  Found URL: $url"
        dev_url="${url/www./dev.}"

        # Upload to Cloudinary
        echo "  Uploading to Cloudinary..."
        upload_result=$(cld uploader upload "$dev_url" folder=deepwave.org use_filename="true" unique_filename="false")
        
        # Extract the url (not secure_url) from the JSON response
        new_url=$(echo "$upload_result" | grep -o '"url": "[^"]*"' | cut -d '"' -f 4)
        
        if [ -n "$new_url" ]; then
            echo "  ✓ Upload successful: $new_url"
            
            # Escape special characters in the URL for sed
            escaped_url=$(echo "$url" | sed 's/[\/&]/\\&/g')
            escaped_new_url=$(echo "$new_url" | sed 's/[\/&]/\\&/g')
            
            # Replace the URL in the file
            sed -i "s|$escaped_url|$escaped_new_url|g" "$file"
            echo "  ✓ Replaced URL in file"
        else
            echo "  ✗ Upload failed or couldn't parse response"
            echo "  Response: $upload_result"
        fi
        
        echo ""
    done
done

echo "Process complete!"
