import os
from PIL import Image

os.makedirs('public/brand', exist_ok=True)
os.makedirs('public/images/campaign', exist_ok=True)
os.makedirs('public/images/craftsmanship', exist_ok=True)
os.makedirs('public/images/packaging', exist_ok=True)
os.makedirs('public/images/products', exist_ok=True)

# 1. Page 3: Logo and Emblem System
# Page 3 is 1664 x 2080
p3 = Image.open('extracted_identity/page_3_X0.jpg')
w, h = p3.size

# Primary dark logo (top-left tile)
# Top-left box in 2x2 grid roughly x: 80 to 800, y: 350 to 1020
box_primary = (85, 360, 800, 1020)
p3.crop(box_primary).save('public/brand/logo-dark-card.jpg')

# Reversed light logo (top-right tile)
box_reversed = (864, 360, 1579, 1020)
p3.crop(box_reversed).save('public/brand/logo-light-card.jpg')

# Emblem tile (bottom-right tile)
box_emblem = (864, 1140, 1579, 1800)
p3.crop(box_emblem).save('public/brand/emblem-card.jpg')

# 2. Page 12: Fashion Campaign (1122 x 1402)
p12 = Image.open('extracted_identity/page_12_X0.jpg')
pw, ph = p12.size

# Main Hero woman in cream outfit (coastal ramparts)
# Page 12 layout:
# Top row:
# - Left: Woman close-up in cream jacket (0 to 420 x, 250 to 750 y)
# - Middle: Woman full-length standing looking out at sea/village (425 to 795 x, 250 to 750 y)
# - Right: Detail of black zipper with gold emblem (805 to 1122 x, 250 to 750 y)
# Bottom row:
# - Left: Man standing in cream trousers and jacket (0 to 300 x, 765 to 1320 y)
# - Middle-left: Boy sitting in black track suit (305 to 575 x, 765 to 1320 y)
# - Middle-right: Girl standing in cream tracksuit (580 to 845 x, 765 to 1320 y)
# - Right: Man back view showing collar gold emblem (850 to 1122 x, 765 to 1320 y)

p12.crop((18, 250, 435, 755)).save('public/images/campaign/hero-portrait-woman.jpg')
p12.crop((440, 250, 800, 755)).save('public/images/campaign/hero-editorial-woman.jpg')
p12.crop((805, 250, 1104, 755)).save('public/images/craftsmanship/gold-zipper-detail.jpg')

p12.crop((18, 765, 310, 1325)).save('public/images/campaign/man-sport-chic.jpg')
p12.crop((315, 765, 580, 1325)).save('public/images/campaign/boy-sport-chic.jpg')
p12.crop((585, 765, 850, 1325)).save('public/images/campaign/girl-sport-chic.jpg')
p12.crop((855, 765, 1104, 1325)).save('public/images/campaign/man-back-embroidery.jpg')

# Full campaign board
p12.save('public/images/campaign/campaign-full-board.jpg')

# 3. Page 10: Craftsmanship & Labels (1664 x 2080)
p10 = Image.open('extracted_identity/page_10_X0.jpg')
# Top-left: Woven clothing label
p10.crop((30, 135, 760, 800)).save('public/images/craftsmanship/woven-label.jpg')
# Top-middle: Hang tag
p10.crop((805, 135, 1170, 800)).save('public/images/craftsmanship/hang-tag.jpg')
# Bottom-left: Care label
p10.crop((30, 915, 760, 1920)).save('public/images/craftsmanship/care-label.jpg')
# Bottom-right: Premium garment tag
p10.crop((780, 915, 1600, 1920)).save('public/images/craftsmanship/garment-tag.jpg')

# 4. Page 9: Packaging (1664 x 2080)
p9 = Image.open('extracted_identity/page_9_X0.jpg')
p9.crop((40, 40, 1620, 2040)).save('public/images/packaging/luxury-packaging.jpg')

# 5. Page 13: Brand Applications (woman in black blazer, embroidered sweatshirt)
p13 = Image.open('extracted_identity/page_13_X0.jpg')
p13.crop((20, 140, 620, 1340)).save('public/images/campaign/woman-black-sweatshirt.jpg')
p13.crop((20, 1350, 520, 2040)).save('public/images/campaign/woman-black-blazer.jpg')

# 6. Page 5: Editorial model portrait with gold earrings
p5 = Image.open('extracted_identity/page_5_X0.jpg')
p5.crop((95, 1150, 1190, 2040)).save('public/images/campaign/editorial-portrait-tunisian-light.jpg')

print("All campaign and brand assets extracted successfully!")
