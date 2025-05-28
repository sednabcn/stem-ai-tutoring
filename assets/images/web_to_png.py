from PIL import Image

# Open the webp image
webp_image_path = '/mnt/data/DALL·E 2024-09-07 16.09.56 - A modern logo for \'SiMLeng\' (Simulation, Modeling, and Machine Learning in Engineering). This design should focus more on teaching and machine learnin.webp'
img = Image.open(webp_image_path)

# Convert to PNG and save it
png_image_path = '/mnt/data/SiMLeng_logo_converted.png'
img.save(png_image_path, 'PNG')

png_image_path
