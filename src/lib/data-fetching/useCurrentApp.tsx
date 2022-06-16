import { App } from '../model/App';

export function useCurrentApp(): App {
  // TODO: Replace mock implementation

  // TODO: Load branch deployment config correctly
  // const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL;
  // const cleanedHostName = hostName
  //   // Allow test deployments on zeit
  //   .replace(/-[a-z0-9]+\.now\.sh$/, '.now.sh')
  //   // Allow branch test deployments
  //   .replace(/.*\.wheelmap\.tech$/, 'wheelmap.tech');
  // return `${baseUrl}/apps/${cleanedHostName}.json?appToken=${appToken}`;

  // ensure to keep widget/custom whitelabel parameters
  // if (includeSourceIds && includeSourceIds.length > 0) {
  //   const includeSourceIdsAsString = includeSourceIds.join(',');
  //   if (includeSourceIdsAsString !== app.clientSideConfiguration.includeSourceIds.join(',')) {
  //     params.includeSourceIds = includeSourceIdsAsString;
  //   }
  // }

  // if (excludeSourceIds && excludeSourceIds.length > 0) {
  //   const excludeSourceIdsAsString = excludeSourceIds.join(',');
  //   if (excludeSourceIdsAsString !== app.clientSideConfiguration.excludeSourceIds.join(',')) {
  //     params.excludeSourceIds = excludeSourceIdsAsString;
  //   }
  // }

  // if (
  //   typeof disableWheelmapSource !== 'undefined' &&
  //   disableWheelmapSource !== app.clientSideConfiguration.disableWheelmapSource
  // ) {
  //   params.disableWheelmapSource = disableWheelmapSource ? 'true' : 'false';
  // }

  return {
    _id: 'localhost',
    name: 'Wheelmap (localhost)',
    description:
      'Wheelmap.org is an online, worldwide map for finding and marking wheelchair accessible places, developed by the German nonprofit organisation **Sozialhelden e.V**.\n\nAnyone can find and add public places to the map and rate them according to a simple traffic light system.\n\nThe map, which is based on OpenStreetMap, was created in 2010 by a team around social entrepreneur Raul Krauthausen to help people who use wheelchairs or wheeled walkers to plan their days more easily.\n\nParents pushing a baby carriage can also benefit from the Wheelmap information.\n\nCurrently almost 600,000 public places worldwide can be found on the map. About 300 new places are added on a daily basis. Wheelmap ist available on the website and as an app for iOS, Android and Windows Phone.',
    organizationId: 'LPb4y2ri7b6fLxLFa',
    tokenString: '456e4b5216aced82122d7cf8f69e445',
    clientSideConfiguration: {
      meta: {
        twitter: {
          siteHandle: '@wheelmap',
          creatorHandle: '@sozialhelden',
          imageURL:
            'https://asset0.wheelmap.org/assets/wheely_big-38212f1add6dd8fa65096214af1fb70ede54a39d702cf18cd0bc9522bce39f2e.jpg',
        },
        facebook: {
          appId: '289221174426029',
          admins: '534621246',
          imageURL:
            'https://asset0.wheelmap.org/assets/wheely_big-38212f1add6dd8fa65096214af1fb70ede54a39d702cf18cd0bc9522bce39f2e.jpg',
        },
      },
      includeSourceIds: [],
      excludeSourceIds: [],
      textContent: {
        onboarding: {
          headerMarkdown: {
            en_US:
              'Mark and find wheelchair accessible places — worldwide and for free. It’s easy with our traffic light system:',
            ar:
              'حدد واعثر على الأماكن التي يمكن دخولها بالكراسي المتحركة - في جميع أنحاء العالم ومجاناً. إنه أمر سهل مع نظامنا المشابه لإشارات المرور: ',
            bg:
              'Маркирайте и намерите места, достъпни за инвалидни колички - по целия свят и безплатно. Лесно е с нашата светофарна система:',
            ca:
              'Marqueu i trobeu llocs accessibles per a cadires de rodes a tot el món i de forma gratuïta. És fàcil amb el nostre sistema de semàfors:',
            cs:
              'Označujte a nacházejte místa přístupná pro vozíčkáře – po celém světě a zdarma. Díky našemu semaforovému systému je to snadné:',
            da:
              'Markér og find steder, der er tilgængelige for kørestolsbrugere – gratis, i hele verden. Det er nemt med vore trafiklyssystem:',
            de:
              'Finde und markiere rollstuhlgerechte Orte – weltweit und kostenlos. Mit dem einfachen Wheelmap-Ampelsystem:',
            el:
              'Σημειώστε και βρείτε μέρα προσβάσιμα σε αναπηρικά αμαξίδια, σε όλο τον κόσμο, δωρεάν. Η διαδικασία είναι εύκολη και γρήγορη με το σύστημά μας:',
            es:
              'Marca y encuentra lugares accesibles en silla de ruedas - en todo el mundo y gratuita. Es muy fácil gracias a nuestro sistema de semáforo:',
            fi:
              'Merkitse ja etsi pyörätuolia käyttävälle esteettömiä paikkoja—maailmanlaajuisesti ja ilmaiseksi. Liikennevalojen avulla se on helppoa:',
            fr:
              "Marquez et trouvez des lieux accessibles en fauteuil roulant, partout dans le monde et gratuitement. C'est facile avec notre système de signalisation:",
            he:
              'סמן ומצא מקומות המותאמים לכיסאות גלגלים—בפריסה עולמית ובחינם. זה קל עם מערכת הרמזורים שלנו:',
            hu:
              'Jelölj be és találj meg kerekesszékkel hozzáférhető helyeket – világszerte és ingyen. A jelzőlámpa rendszerünkkel egyszerű:',
            it:
              'Segnala e trova luoghi accessibili alle sedie a rotelle – in tutto il mondo e gratuitamente. È facile con il nostro sistema di semafori:',
            ja:
              '車椅子可の場所に印を付けたり、車椅子可の場所を見つけましょう—世界中、無料で。当サイトの信号システムなら簡単です：',
            ko:
              '전 세계의 휠체어 이용 가능 장소를 무료로 표시하고 찾으세요. 편의를 위해 다음과 같은 신호등 시스템을 제공합니다.',
            mn:
              'Тэргэнцэрт хүртээмжтэй газруудыг дэлхий даяар чөлөөтэй хайх болон тэмдэглэх. Та үүнийг бидний гэрлэн дохионы системийн тусламжайгаар амархан хийх болно. ',
            nl:
              'Markeer en vind rolstoeltoegankelijke locaties - over de hele wereld en gratis. Het is makkelijk met ons verkeerslichtsysteem:',
            no:
              'Marker og finn rullestolvennlige steder— over hele verden og gratis. Det er enkelt med vårt trafikklyssystem: ',
            pl:
              'Oznacz i znajdź miejsca dostępne dla wózków – na całym świecie i za darmo. To łatwe dzięki naszemu systemowi kolorów:',
            pt:
              'Marque e encontre locais acessíveis a cadeiras de rodas, em todo o mundo e de graça. É fácil com o nosso sistema de semáforo:',
            ro:
              'Marchează şi găseşte locuri accesibile scaunelor cu rotile—în toată lumea şi gratuit. Este simplu cu sistemul nostru de semaforizare:',
            ru:
              'Отмечайте и находите места, доступные для кресел-каталок по всему миру совершенно бесплатно. Это легко сделать благодаря нашей системе «светофора»:',
            sk:
              'Označte a nájdite miesta prístupné pre vozíčkarov na celom svete zadarmo. S našim semaforovým systémom je to jednoduché:',
            sv:
              'Finn och markera rullstolstillgängliga platser–över hela världen och kostnadsfritt. Det är lätt med vårt trafikljusliknande system:',
            tr:
              'Dünyanın her yerinde tekerlekli sandalye erişimine uygun mekanları Wheelmap.org ile ücretsiz olarak işaretleyin ve bulun. Çok kolay:',
            zh_TW: '在世界各地免費查找輪椅通道的地方。用我們的系統是很簡單：',
            de_DE:
              'Finde und markiere rollstuhlgerechte Orte — weltweit und kostenlos. So einfach geht’s mit unserem Ampelsystem:',
          },
        },
        product: {
          name: {
            en_US: 'Wheelmap',
            de_DE: 'Wheelmap',
            sq_AL: 'Wheelmap',
            ar: 'ويل ماب',
            ca: 'Wheelmap',
            bg: 'Wheelmap',
            hi: 'व्हीलमैप',
            el:
              'Σημανση και βρείτε προσβάσιμα από αναπηρικά αμαξίδια μέρη με το Wheelmap.org - σε όλο τον κόσμο και δωρεάν. Το σύστημα φωτεινού σηματοδότη για να επισημάνετε την προσβασιμότητα δημόσιων χώρων με αναπηρικό καροτσάκι:',
            fr:
              "Marquer et trouver des lieux accessibles en fauteuil roulant grâce à Wheelmap.org – à travers le monde et gratuitement. Notre système de feux de circulation pour marquer l'accessibilité en fauteuil roulant des lieux publics :",
          },
          claim: {
            en_US: 'Find wheelchair accessible places.',
            de_DE: 'Finde rollstuhlgerechte Orte.',
            de: 'Finde rollstuhlgerechte Orte.',
            zh_TW: '尋找輪椅無障礙空間',
            el: 'Βρείτε μέρη/τοποθεσίες, προσβάσιμα με αναπηρική καρέκλα.',
            is: 'Finndu hjólastólaaðgengilega staði.',
            it: 'Trova luoghi accessibili in sedia a rotelle.',
            ar: 'ابحث عن أماكن يسهل الوصول اليها بالكرسي المتحرك',
            cs: 'Najít bezbariérová místa.',
            es: 'Busca lugares accesibles para silla de ruedas.',
            ru: 'найти места, доступные на кресле-коляске.',
            nl: 'Vind rolstoel toegangelijke plaatsen.',
            pt: 'Encontre lugares com acessibilidade para cadeira de rodas.',
            nb: 'Finn rullestoltilgjengelige steder.',
            tr: 'Tekerlekli sandalye ile ulaşılır yerler bulun.',
            lv: 'Atrodiet ar ratiņkrēslu pieejamas vietas.',
            ca: 'Cerca llocs accessibles amb cadira de rodes.',
            pl: 'Znajdź miejsca dostępne dla osób na wózkach.',
            fr: 'Trouver des lieux accessibles en fauteuil roulant.',
            bg: 'намери места, достъпни за инвалидни колички.',
            da: 'Find kørestolstilgængelige steder.',
            hi: 'व्हीलचेयर सुलभ स्थान ढूंढें',
            hu: 'Keress kerekesszékkel is akadálymentes helyeket.',
            ja: '車椅子で行ける場所を見つけよう',
            ko: '휠체어 접근가능 장소찾기',
            sv: 'Hitta rullstolstillgängliga platser.',
            sk: 'Nájdite miesta prístupné pre vozíčkarov.',
            uk: 'пошук місць, що доступні для людей на інвалідних візках.',
          },
          description: {
            en_US:
              'Wheelmap is an online map to search, find and mark wheelchair-accessible places. Get involved by marking public places like bars, restaurants, cinemas or supermarkets!',
            de_DE:
              'Wheelmap.org ist eine Onlinekarte zum Finden, Suchen und Markieren von rollstuhlgerechten Orten. Mach mit, indem du z.B. Bars, Restaurants, Kinos und Supermärkte markierst!',
            zh_TW:
              'Wheelmap.org是一個在線地圖搜索，找到和標記輪椅容易接近的地方。獲得通過標記公共場所如酒吧，餐館，電影院和超市參與！',
            it:
              'Wheelmap.org è una mappa online per cercare, trovare e segnare luoghi accessibili ai disabili. Fatti coinvolgere segnando luoghi pubblici come bar, ristoranti, cinema o supermercati!',
            cs:
              'Wheelmap.org je online mapa k vyhledávání a označení míst vhodných pro vozíčkáře. Zapojte se do označování veřejných míst, jako jsou bary, restaurace, kina nebo supermarkety.',
            es:
              'Wheelmap.org es un mapa en línea para buscar, encontrar y marcar lugares accesibles para silla de ruedas. ¡Participa marcando lugares públicos como bares, restaurantes, cines o supermercados!',
            ru:
              'Wheelmap.org - это онлайн-карта предназначенная для того, чтобы искать и отмечать места, доступных на инвалидных колясках. Примите участие, отметив общественные места, такие как бары, рестораны, кинотеатры и супермаркеты!',
            pt:
              'Wheelmap.org é um serviço na Internet para procurar, encontrar e marcar locais com acessibilidade a cadeiras de rodas. Ajude também a marcar locais públicos como bares, restaurantes, cinemas ou supermercados!',
            tr:
              'Wheelmap.org, tekerlekli sandalye erişimine uygun mekanları aramak, bulmak ve işaretlemek için kullanılan çevrimiçi bir haritadır. Barlar, restoranlar, sinemalar veya süpermarketler gibi herkese açık mekanları işaretleyerek sen de katıl!',
            pl:
              'Wheelmap.org jest mapą online, na której możesz wyszukiwać i oznaczać miejsca dostępne dla osób na wózkach inwalidzkich. Zaangażuj się i dodawaj miejsca publiczne takie jak bary, restauracje, kina, supermarkety i inne!',
            fr:
              'Wheelmap.org est une carte en ligne pour rechercher, trouver et marquer des lieux accessibles aux fauteuils roulants. Impliquez-vous en indiquant les lieux publics comme les bars, les restaurants, les cinémas ou les supermarchés!',
            ja:
              'Wheelmap.orgは車椅子でアクセス可能な場所を探したり入力したりできるオンラインマップです。公共施設、バー、レストランや映画館、スーパーマーケットについて利用可否をマークしてぜひご参加ください',
            sv:
              'Wheelmap.org är en online-karta för att söka, hitta och markera rullstolstillgängliga platser. Bli delaktig genom att markera offentliga platser som t ex barer, restauranger, bio och mataffärer!',
            sk:
              'Wheelmap.org je online mapa určená na vyhľadávania a označovanie miest prístupných pre vozíčkarov. Zapojte sa označením verejným miest akými sú barym reštaurácie, kiná alebo supermarkety!',
          },
        },
      },
      branding: {
        vectorIconSVG: {
          data:
            '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="none" viewBox="0 0 128 128"><rect width="128" height="128" fill="#D51030" rx="26"/><path fill="#fff" d="M52.39 41.963c4.367 4.436 11.163 4.276 15.426-.059l-15.425.06zM73.853 90.22H63.164v-8.84c0-1.53-1.22-2.77-2.724-2.77-1.505 0-2.725 1.24-2.725 2.77v8.84H47.57c-1.482.032-2.666 1.262-2.666 2.769 0 1.506 1.184 2.736 2.666 2.768h10.145v9.577c0 1.529 1.22 2.769 2.725 2.769 1.505 0 2.724-1.24 2.724-2.769v-9.577h10.687c.973 0 1.872-.527 2.359-1.383a2.808 2.808 0 000-2.77 2.716 2.716 0 00-2.358-1.384zm34.016 9.69a2.751 2.751 0 00-1.351-1.614 2.678 2.678 0 00-2.078-.169l-5.602 1.837-7.579-21.827a2.746 2.746 0 00-1.465-1.609 2.675 2.675 0 00-2.157-.023l-5.131 2.187a26.537 26.537 0 00-10.407-9.916l-2.523-7.979a15.878 15.878 0 00-3.556-6.078h4.6c8.599 0 15.596-7.11 15.596-15.852V25.853C86.215 17.112 79.218 10 70.619 10h-21.03c-8.6 0-15.597 7.112-15.597 15.853v13.013c0 6.153 3.47 11.495 8.523 14.12l-.69.226c-8.187 2.674-12.707 11.62-10.076 19.942l3.48 11.003a26.911 26.911 0 00-1.294 8.244c0 14.667 11.74 26.599 26.168 26.599 14.43 0 26.17-11.932 26.17-26.6 0-3.045-.519-5.967-1.45-8.693l2.258-.961 7.501 21.6c.49 1.415 2 2.175 3.405 1.714l8.127-2.664a2.731 2.731 0 001.587-1.374 2.81 2.81 0 00.167-2.112zM39.442 38.867V27.94h41.323v10.926c0 5.687-4.551 10.314-10.147 10.314H49.589c-5.596-.001-10.147-4.627-10.147-10.314zm-2.505 32.593c-1.712-5.414 1.229-11.235 6.556-12.975l8.13-2.656a9.873 9.873 0 013.08-.493c4.417-.016 8.336 2.879 9.685 7.155l1.238 3.916c-1.815-.4-3.666-.601-5.523-.602-8.827 0-16.64 4.47-21.382 11.295l-1.784-5.64zm23.446 41.814c-11.425 0-20.741-9.391-20.741-21.005 0-11.612 9.316-21.004 20.74-21.004 11.425 0 20.741 9.525 20.741 21.137 0 11.613-9.316 20.872-20.74 20.872zm-7.116-76.272c-1.502 0-2.72-1.237-2.72-2.764 0-1.527 1.218-2.764 2.72-2.764 1.502 0 2.72 1.237 2.72 2.764 0 1.527-1.218 2.764-2.72 2.764zM66.94 37c-1.502 0-2.719-1.237-2.719-2.763 0-1.526 1.217-2.763 2.719-2.763 1.501 0 2.718 1.237 2.718 2.763 0 1.526-1.217 2.763-2.718 2.763z"/></svg>',
          info: {
            colors: {
              fills: ['#d51030', '#ffffff'],
              strokes: [],
            },
            height: 128,
            width: 128,
          },
        },
        vectorLogoSVG: {
          data:
            '<svg xmlns="http://www.w3.org/2000/svg" width="845" height="98" fill="none" viewBox="0 0 845 98"><path fill="#2E3F5D" fill-rule="evenodd" d="M178.263 51.697c.3 3.566 1.388 6.2 3.272 7.994 1.864 2.034 4.706 3.064 8.616 3.064a14.464 14.464 0 006.726-1.454c.33-.1.633-.275.887-.509l1.166-1.036c.346-.62 1.037-1.233 2.106-1.956 1.27-.867 2.985-1.278 5.142-1.278h13.674l-.437 1.46c-1.857 6.292-5.429 11.117-10.663 14.41-5.214 3.436-11.744 5.144-19.572 5.144-9.516 0-17.024-2.771-22.42-8.307-5.41-5.398-8.102-13.079-8.102-22.983 0-9.46 2.607-16.919 7.847-22.318 5.41-5.548 12.918-8.313 22.434-8.313 9.991 0 17.806 2.68 23.398 8.098 5.41 5.542 8.101 13.216 8.101 22.97v2.367c0 .893-.111 1.565-.391 2.06l-.326.587h-41.458zm.02-11.97h22.238c-.417-2.987-1.395-5.19-2.907-6.651-1.871-1.78-4.582-2.693-8.186-2.693-3.292 0-5.931.913-7.978 2.726-1.779 1.578-2.841 3.768-3.167 6.617zm64.4 11.97c.306 3.566 1.388 6.2 3.272 7.994 1.864 2.034 4.712 3.064 8.616 3.064a14.466 14.466 0 006.726-1.454c.33-.1.633-.275.886-.509l1.16-1.03c.346-.62 1.037-1.239 2.112-1.969 1.271-.86 2.992-1.271 5.149-1.271h13.667l-.43 1.46c-1.864 6.292-5.436 11.117-10.669 14.41-5.214 3.436-11.745 5.144-19.566 5.144-9.522 0-17.03-2.771-22.42-8.307-5.416-5.398-8.108-13.079-8.108-22.983 0-9.46 2.607-16.919 7.854-22.318 5.409-5.548 12.911-8.313 22.433-8.313 9.991 0 17.806 2.68 23.398 8.098 5.403 5.542 8.095 13.216 8.095 22.97v2.367c0 .893-.111 1.565-.391 2.06l-.326.587h-41.458zm.026-11.97h22.238c-.417-2.987-1.402-5.19-2.914-6.644-1.87-1.787-4.582-2.7-8.186-2.7-3.285 0-5.931.913-7.977 2.726-1.779 1.578-2.835 3.768-3.161 6.617zm255.416 31.406v17.97c0 2.333-.951 4.368-2.809 6.017l.013-.013a9.642 9.642 0 01-6.608 2.458h-9.399V42.81c0-10.432 3.507-17.675 10.546-21.561a45.151 45.151 0 0122.166-5.627c4.165 0 8.375.698 12.624 2.1 4.302 1.42 7.743 3.494 10.337 6.259 5.045 5.816 7.561 13.261 7.561 22.272 0 9.304-2.51 16.887-7.567 22.716-5.084 5.705-11.621 8.567-19.553 8.567-4.197 0-7.912-.672-11.152-2.035a18.517 18.517 0 01-6.152-4.368h-.007zm25.38-24.235c0-5.359-1.141-9.415-3.389-12.205-2.197-2.732-5.345-4.088-9.542-4.088-4.028 0-7.098 1.356-9.307 4.107-2.073 2.478-3.135 6.54-3.135 12.186 0 5.197 1.134 9.024 3.389 11.56 2.203 2.732 5.344 4.095 9.542 4.095 3.865 0 6.85-1.356 9.059-4.095 2.242-2.797 3.389-6.637 3.389-11.56h-.006zm-60.62 27.09l.019-.006a33.924 33.924 0 01-11.177 3.006c-3.383.34-6.778.522-10.187.548-6.042 0-11.354-1.46-15.922-4.382-4.719-3.025-7.079-8.02-7.079-14.846 0-6.39 2.151-11.064 6.466-13.874 4.119-2.686 9.34-4.46 15.805-5.353.73 0 1.629-.104 2.698-.306a45.992 45.992 0 013.963-.548c6.589-.802 9.672-2.413 9.672-4.466 0-1.598-.873-2.57-2.907-3.09a26.766 26.766 0 00-6.628-.933c-2.151 0-4.048.267-5.716.802a5.212 5.212 0 00-3.213 2.66l-.32.626h-18.294l.189-1.304c.69-4.753 3.121-8.685 7.234-11.723 4.595-3.469 11.067-5.183 19.39-5.183 9.255 0 16.242 1.401 20.993 4.257 5.031 3.078 7.593 7.459 7.593 13.027v19.593c0 5.959-1.239 10.673-3.741 14.122-2.464 3.39-5.41 5.861-8.838 7.374zm-5.501-25.825a60.104 60.104 0 01-8.101 2.224l-5.527 1.062c-2.672.665-4.588 1.5-5.729 2.465-.952 1.356-1.408 2.673-1.408 3.964 0 1.832.593 3.247 1.753 4.27 1.226.972 3.077 1.474 5.592 1.474 4.269 0 7.561-1.056 9.92-3.149 2.333-2.073 3.5-4.916 3.5-8.626v-3.684zM46.602 39.27l-9.04 37.19H18.805L.379 16.907h18.953l9.249 35.925 8.369-35.925h19.07l7.912 35.846 7.782-29.848c1.121-3.964 4.171-5.998 8.877-5.998h12.24L74.399 76.46H55.655l-9.053-37.19zm65.469-16.965c2.868-3.051 6.537-5.06 10.988-6.018a28.734 28.734 0 0115.949.913 28.13 28.13 0 0111.894 8.521c3.259 3.958 4.869 9.376 4.869 16.222v34.51h-18.562V45.615c0-2.067-.195-3.958-.587-5.672-.364-1.624-1.218-3.306-2.574-5.04l.013.013c-2.203-2.739-5.194-4.095-9.059-4.095-4.204 0-7.365 1.304-9.555 3.9-2.242 2.646-3.376 6.337-3.376 11.11v30.636H93.268V.105h9.405c2.541 0 4.757.822 6.589 2.445 1.857 1.657 2.809 3.684 2.809 6.018v13.738zM289.687.118h9.887c2.529 0 4.739.769 6.577 2.314 1.87 1.584 2.828 3.586 2.828 5.933v68.089h-19.292V.118zm75.526 20.603a23.98 23.98 0 018.362-3.678 54.973 54.973 0 0110.578-1.427c7.313 0 14.058 1.695 20.23 5.092 6.401 3.534 9.568 10.601 9.568 21.02v34.726h-9.646c-2.698 0-4.953-.77-6.713-2.335a7.851 7.851 0 01-2.685-6.129V38.716c0-3.084-1.01-5.236-3.031-6.598a12.685 12.685 0 00-7.234-2.165c-2.679 0-5.091.717-7.235 2.171-2.02 1.356-3.024 3.508-3.024 6.585V76.46h-19.051V38.703c0-3.078-1.004-5.23-3.024-6.592a12.7 12.7 0 00-7.247-2.165 12.118 12.118 0 00-7.098 2.159c-1.936 1.356-2.907 3.507-2.907 6.604v37.738h-19.292V41.728c0-10.126 3.037-17.043 9.19-20.577 5.898-3.39 12.435-5.242 19.631-5.542 3.793 0 7.508.372 11.151 1.108 3.455.698 6.687 2.067 9.477 4.004z" clip-rule="evenodd"/><path fill="#D51030" d="M617.596 14.889c.65 0 1.212.237 1.685.711.473.474.71 1.037.71 1.689V31.6c0 .652-.237 1.215-.71 1.689s-1.035.711-1.685.711h-19.07v40.711c0 .652-.237 1.215-.71 1.689s-1.034.711-1.685.711H577.86c-.651 0-1.213-.237-1.686-.711a2.31 2.31 0 01-.709-1.689V34h-19.07c-.651 0-1.212-.237-1.685-.711-.473-.474-.71-1.037-.71-1.689V17.289c0-.652.237-1.215.71-1.689s1.034-.711 1.685-.711h61.201zM691.091 59.778c.651 0 1.212.237 1.685.71.473.475.71 1.038.71 1.69V74.71c0 .652-.237 1.215-.71 1.689s-1.034.711-1.685.711h-56.056c-.651 0-1.213-.237-1.686-.711a2.31 2.31 0 01-.709-1.689V17.29c0-.652.236-1.215.709-1.689s1.035-.711 1.686-.711h55.169c.651 0 1.212.237 1.685.711.473.474.71 1.037.71 1.689v12.533c0 .652-.237 1.215-.71 1.69-.473.473-1.034.71-1.685.71h-34.503v5.6h29.625c.65 0 1.212.237 1.685.711.473.474.71 1.037.71 1.69v11.555c0 .652-.237 1.215-.71 1.689s-1.035.71-1.685.71h-29.625v5.6h35.39zM729.551 53.111c0 2.43.798 4.296 2.395 5.6 1.656 1.304 3.873 1.956 6.652 1.956 2.484 0 4.317-.415 5.499-1.245 1.183-.83 2.188-2.074 3.016-3.733.769-1.54 1.804-2.311 3.104-2.311h19.159c.532 0 .976.207 1.33.622.414.356.621.8.621 1.333 0 3.615-1.212 7.17-3.636 10.667-2.425 3.437-6.12 6.311-11.087 8.622-4.908 2.252-10.91 3.378-18.006 3.378-6.327 0-11.974-.948-16.941-2.844-4.908-1.956-8.811-4.919-11.708-8.89-2.898-4.029-4.346-9.036-4.346-15.022V40.756c0-5.986 1.448-10.963 4.346-14.934 2.897-4.03 6.8-6.992 11.708-8.889C726.624 14.978 732.271 14 738.598 14c7.096 0 13.098 1.156 18.006 3.467 4.967 2.252 8.662 5.126 11.087 8.622 2.424 3.437 3.636 6.963 3.636 10.578 0 .533-.207 1.007-.621 1.422-.354.355-.798.533-1.33.533h-19.159c-1.3 0-2.335-.77-3.104-2.31-.828-1.66-1.833-2.905-3.016-3.734-1.182-.83-3.015-1.245-5.499-1.245-2.779 0-4.996.652-6.652 1.956-1.597 1.304-2.395 3.17-2.395 5.6V53.11zM842.605 14.889c.651 0 1.212.237 1.685.711.473.474.71 1.037.71 1.689V74.71c0 .652-.237 1.215-.71 1.689s-1.034.711-1.685.711h-18.271c-.651 0-1.213-.237-1.686-.711a2.31 2.31 0 01-.709-1.689V55.778h-17.74V74.71a2.31 2.31 0 01-.709 1.689c-.473.474-1.035.711-1.685.711h-18.272a2.47 2.47 0 01-1.685-.622c-.473-.474-.71-1.067-.71-1.778V17.29c0-.652.237-1.215.71-1.689s1.034-.711 1.685-.711h18.272c.65 0 1.212.237 1.685.711a2.31 2.31 0 01.709 1.689V35.51h17.74V17.29c0-.652.236-1.215.709-1.689s1.035-.711 1.686-.711h18.271z"/></svg>',
          info: {
            colors: {
              fills: ['#2e3f5d', '#d51030'],
              strokes: [],
            },
            height: 98,
            width: 845,
          },
        },
      },
    },
    related: {
      appLinks: {
        '4BFNR3F7XfFmi': {
          _id: '4BFNR3F7XfFmi',
          appId: 'localhost',
          label: {
            ar: 'أخبار',
            bg: 'Новини',
            ca: 'Noticies',
            cs: 'Zprávy',
            da: 'Nyheder',
            el: 'Ειδήσεις',
            en_US: 'News',
            es: 'Noticias',
            fi: 'Uutiset',
            fr: 'Nouvelles',
            he: 'חדשות',
            hu: 'Hírek',
            it: 'Notizie',
            ja: 'ニュース',
            ko: '뉴스',
            mn: 'Мэдээ',
            nl: 'Nieuws',
            no: 'Nyheter',
            pl: 'Aktualności',
            pt: 'Novidades',
            ro: 'Ştiri',
            ru: 'Новости',
            sk: 'Novinky',
            sv: 'Nyheter',
            tr: 'Haberler',
            zh_TW: '新消息',
            de_DE: 'Neues',
            de: 'Neues',
          },
          url: {
            en_US: 'https://news.wheelmap.org/en/#news',
            de: 'https://news.wheelmap.org/#news',
          },
          order: 2,
        },
        '7sanolzBiuuoB': {
          _id: '7sanolzBiuuoB',
          appId: 'localhost',
          label: {
            ar: 'تعليقات صحفية',
            bg: 'Преса',
            ca: 'Premsa',
            cs: 'Tisk',
            da: 'Presse',
            de: 'Presse',
            el: 'Τύπος',
            en_US: 'Press',
            es: 'Prensa',
            fi: 'Media',
            fr: 'Presse',
            he: 'לחץ',
            hu: 'Sajtó',
            it: 'Stampa',
            ja: '押す',
            ko: '보도자료',
            mn: 'Хэвлэх',
            nl: 'Pers',
            no: 'Presse',
            pl: 'Prasa',
            pt: 'Imprensa',
            ro: 'Presa',
            ru: 'Нажмите',
            sk: 'Stlačiť',
            sv: 'Media',
            tr: 'Basın',
            zh_TW: '新聞',
            de_DE: 'Presse',
          },
          url: {
            en_US: 'https://news.wheelmap.org/en/press/',
            de: 'https://news.wheelmap.org/press/',
          },
          order: 3,
        },
        Lkrk9bcK8B2WV: {
          _id: 'Lkrk9bcK8B2WV',
          appId: 'localhost',
          label: {
            ar: 'طباعة',
            bg: 'Данни за издателя',
            ca: 'Peu de pagina',
            cs: 'Otisk',
            da: 'Aftryk',
            de: 'Impressum',
            el: 'Αποτύπωμα',
            en_US: 'Legal',
            es: 'Aviso legal',
            fi: 'Tietoa',
            fr: 'Impression',
            he: 'חותם',
            hu: 'Impresszum',
            it: 'Impronta',
            ja: 'インプリント',
            ko: '인쇄',
            mn: 'Дардас',
            nl: 'Colofon',
            no: 'Avtrykk',
            pl: 'Informacje prawne',
            pt: 'Sobre',
            ro: 'Imprimeu',
            ru: 'Импринт',
            sk: 'Stopa',
            sv: 'Om oss',
            tr: 'Yayıncı',
            zh_TW: '版本說明',
            de_DE: 'Impressum',
          },
          url: {
            en_US: 'https://news.wheelmap.org/en/imprint/',
            de: 'https://news.wheelmap.org/imprint/',
          },
          order: 5,
        },
        iReJHxaBobUaA: {
          _id: 'iReJHxaBobUaA',
          appId: 'localhost',
          label: {
            ar: 'الأسئلة المتكررة',
            bg: 'ЧЗВ',
            ca: 'PMF',
            el: 'Συχνές Ερωτήσεις',
            en_US: 'FAQ',
            es: 'Preguntas frecuentes',
            fi: 'UKK',
            he: 'שאלות נפוצות',
            hu: 'GYIK',
            ja: 'FAQ（よくある質問）',
            mn: 'Түгээмэл Асуулт Хариулт',
            pt: 'Perguntas Frequentes',
            ru: 'ЧаВО',
            sk: 'Častlo kladené otázky',
            sv: 'Frågor & Svar',
            tr: 'SSS',
            zh_TW: '常見問題',
            de_DE: null,
            de: null,
          },
          url: {
            en_US: 'https://news.wheelmap.org/en/FAQ/',
            de: 'https://news.wheelmap.org/FAQ/',
          },
          order: 6,
        },
        PTOuMJJvLf7wQ: {
          _id: 'PTOuMJJvLf7wQ',
          appId: 'localhost',
          label: {
            ar: 'شارك في العمل',
            bg: 'Включете се',
            ca: 'Involucrar-se',
            cs: 'Zapojte se',
            da: 'Bliv involveret',
            de: 'Mitmachen',
            el: 'Συμμετέχετε',
            en_US: 'Get involved',
            es: 'Participar',
            fi: 'Osallistu',
            fr: "S'impliquer",
            he: 'להתערב',
            hu: 'Vegyél részt',
            it: 'Partecipa',
            ja: '参加しましょう',
            ko: '참여하기',
            mn: 'Оруулах ',
            nl: 'Doe mee',
            no: 'Bli involvert',
            pl: 'Zaangażuj się',
            pt: 'Envolva-se',
            ro: 'Implică-te',
            ru: 'Поучаствуйте',
            sk: 'Zapojte sa',
            sv: 'Bli delaktig',
            tr: 'Siz de katılın',
            zh_TW: '參與其中',
            de_DE: 'Mitmachen',
          },
          url: {
            en_US: 'https://news.wheelmap.org/en/wheelmap-ambassador/',
            de: 'https://news.wheelmap.org/wheelmap-ambassador/',
          },
          order: 1,
        },
        '3TfMGbEfd8S74': {
          _id: '3TfMGbEfd8S74',
          appId: 'localhost',
          label: {
            ar: 'الاتصال بنا',
            bg: 'Контакт',
            ca: 'Contacte',
            cs: 'Kontakt',
            da: 'Kontakt',
            de: 'Kontakt',
            el: 'Επικοινωνία',
            en_US: 'Contact',
            es: 'Contacto',
            fi: 'Yhteys',
            he: 'צור קשר',
            hu: 'Kapcsolat',
            it: 'Contatta',
            ja: '連絡先',
            ko: '연락처',
            mn: 'Холбоо барих',
            no: 'Kontakt',
            pl: 'Kontakt',
            pt: 'Contacto',
            ru: 'Контакты',
            sk: 'Kontakt',
            sv: 'Kontakta',
            tr: 'İletişim',
            zh_TW: '聯繫',
            de_DE: 'Kontakt',
          },
          url: {
            en_US: 'https://news.wheelmap.org/en/contact/',
            de: 'https://news.wheelmap.org/contact/',
          },
          order: 4,
        },
        DfrdP6Iv2LiGs: {
          _id: 'DfrdP6Iv2LiGs',
          appId: 'localhost',
          label: {
            ar: 'إضافة مكان ناقص',
            bg: 'Добави липсващо място',
            ca: 'Afegeix lloc desaparegut',
            cs: 'Přidat chybějící místo',
            da: 'Tilføj manglende sted',
            de: 'Neuen Ort hinzufügen',
            en_US: 'Add a new place',
            el: 'Προσθήκη μέρους που λείπει',
            es: 'Añadir un lugar nuevo',
            fi: 'Lisää puuttuva paikka',
            fr: 'Ajouter un nouveau lieu',
            he: 'הוסף מקום חסר',
            hu: 'Hiányzó hely hozzáadása',
            it: 'Aggiungi luogo mancante',
            ja: '欠けている場所を追加する',
            ko: '누락된 장소 추가',
            mn: 'Бүртгэлгүй газрыг нэмэх ',
            nl: 'Nieuwe locatie toevoegen',
            no: 'Legg til manglende sted',
            pl: 'Dodaj brakujące miejsce',
            pt: 'Adicionar local em falta',
            ro: 'Adaugă loc lipsă',
            ru: 'Добавить недостающее место',
            sk: 'Pridať chýbajúce miesto',
            sv: 'Lägg till saknad plats',
            tr: 'Haritada olmayan bir mekan ekle',
            zh_TW: '加入丟失的地方',
            de_DE: 'Neuen Ort hinzufügen',
          },
          url:
            'https://ee.humanitarianresponse.info/single/::WBnyIcbH?returnUrl={returnUrl}&d[uniqueSurveyId]={uniqueSurveyId}&d[mappingEventId]={mappingEventId}&d[mappingEventName]={mappingEventName}',
          order: 100,
          tags: ['primary', 'add-place'],
        },
        'localhost-events': {
          _id: 'localhost-events',
          appId: 'localhost',
          label: {
            de: 'Events',
            en_US: 'Events',
            de_DE: 'Events',
          },
          url: '/events',
          order: 99,
          tags: ['events'],
        },
      },
    },
  };
}
