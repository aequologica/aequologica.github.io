alias inkscape="/Applications/Inkscape.app/Contents/MacOS/inkscape"   
cd pianos/lilyponds  
lilypond -dbackend=svg ∅.ly  
svgo --pretty "∅.svg"
# manually remove Lilypond watermark
inkscape "∅.svg"
# open Document Properties
# resize content to drawing 
# save & quit
svgo --pretty "∅.svg"






