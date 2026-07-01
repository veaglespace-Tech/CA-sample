Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile("c:\Users\ADMIN\Desktop\CA Project\client\public\veaglespace-logo.png")
$newWidth = 1200
$newHeight = 630
$bmp = New-Object System.Drawing.Bitmap $newWidth, $newHeight
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.Clear([System.Drawing.Color]::White)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$ratio = [math]::Min($newWidth / $image.Width, $newHeight / $image.Height)
$drawWidth = $image.Width * $ratio
$drawHeight = $image.Height * $ratio
$graphics.DrawImage($image, ($newWidth - $drawWidth) / 2, ($newHeight - $drawHeight) / 2, $drawWidth, $drawHeight)
$bmp.Save("c:\Users\ADMIN\Desktop\CA Project\client\src\app\opengraph-image.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Save("c:\Users\ADMIN\Desktop\CA Project\client\src\app\twitter-image.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$graphics.Dispose()
$bmp.Dispose()
$image.Dispose()
