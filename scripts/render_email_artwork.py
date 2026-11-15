from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
out=Path("email-previews");out.mkdir(exist_ok=True)
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def ft(n,b=False):return ImageFont.truetype(B if b else F,n)
def rgb(x):return tuple(bytes.fromhex(x))
sets=[
("les-delices.jpg","F8F2EA","A35B41","382C2B","F2E5D7","LES DÉLICES · FRENCH BAKERY",["A sweeter way","to order cakes."],["An elegant online storefront for signature cakes,","special occasions, and easy pickup inquiries."],"Explore the cake collection","Beautiful cakes · Simple inquiries · Mobile first","Your cake order, simplified",[("Browse cakes","Elegant category cards"),("Customize a cake","Size, flavor and occasion"),("Send an inquiry","Pickup details in one place")],"Request a custom cake"),
("total-rc.jpg","EFF4F1","257653","213E35","DDEDE3","TOTAL RC SOLUTIONS",["More clarity.","Better inquiries."],["Help customers choose the right service and","describe their project before requesting a quote."],"Request a project estimate","Landscaping · Painting · Cleanouts · More","Smart project intake",[("Choose a service","Match the right team"),("Describe the job","Photos and requirements"),("Request estimate","Easy follow-up for your team")],"Submit project details"),
("a-and-j.jpg","F9F2EB","A35437","372D28","F2E5DA","A&J RESTAURANT · ROCKVILLE",["Busy kitchen.","Smarter support."],["An AI-assisted experience for routine questions,","ordering guidance and peak-hour inquiries."],"Ask the dining assistant","Menu help · Hours · Ordering guidance","AI assistant concept",[("Customer asks","Can I order pickup?"),("Assistant helps","Answers common questions"),("Seamless handoff","Routes to online ordering")],"Continue to order online")]
for (name,bg,accent,ink,pale,brand,headline,sub,cta,foot,panel,rows,panel_cta) in sets:
 im=Image.new("RGB",(1200,680),rgb(bg));d=ImageDraw.Draw(im)
 d.rounded_rectangle((43,36,1157,642),radius=23,fill="white")
 d.rounded_rectangle((43,36,1157,103),radius=23,fill=rgb(ink));d.rectangle((43,82,1157,103),fill=rgb(ink))
 for x,c in [(73,"#ee8276"),(94,"#ecc36d"),(115,"#7cc8aa")]:d.ellipse((x,60,x+12,72),fill=c)
 d.rounded_rectangle((154,54,728,84),radius=8,fill="white")
 d.text((172,60),"INDEPENDENT DESIGN CONCEPT · NOT A LIVE WEBSITE",font=ft(14,True),fill=rgb(ink))
 d.text((916,59),"CONCEPT PREVIEW",font=ft(14,True),fill="white")
 d.text((86,136),brand,font=ft(25,True),fill=rgb(ink))
 d.line((86,177,715,177),fill=rgb(pale),width=2)
 for i,line in enumerate(headline):d.text((86,214+i*59),line,font=ft(43,True),fill=rgb(ink))
 for i,line in enumerate(sub):d.text((89,370+i*33),line,font=ft(18),fill=rgb(ink))
 width=d.textbbox((0,0),cta,font=ft(17,True))[2]+44
 d.rounded_rectangle((88,460,88+width,503),radius=12,fill=rgb(accent))
 d.text((110,471),cta,font=ft(17,True),fill="white")
 d.text((88,553),"POSSIBLE CUSTOMER EXPERIENCE",font=ft(14,True),fill=rgb(accent))
 d.text((88,578),foot,font=ft(18),fill=rgb(ink))
 d.rounded_rectangle((749,146,1110,589),radius=21,fill=rgb(pale))
 d.rounded_rectangle((777,172,1085,217),radius=13,fill="white")
 d.text((798,186),panel,font=ft(18,True),fill=rgb(ink))
 for i,(head,tail) in enumerate(rows):
  y=239+i*90;d.rounded_rectangle((777,y,1084,y+76),radius=13,fill="white")
  d.ellipse((796,y+22,825,y+51),fill=rgb(accent))
  d.text((839,y+13),head,font=ft(17,True),fill=rgb(ink))
  d.text((839,y+43),tail,font=ft(14),fill=rgb(ink))
 d.rounded_rectangle((777,516,1084,561),radius=10,fill=rgb(ink))
 tw=d.textbbox((0,0),panel_cta,font=ft(16,True))[2]
 d.text((931-tw/2,529),panel_cta,font=ft(16,True),fill="white")
 im.save(out/name,format="JPEG",quality=91,optimize=True,progressive=True)
