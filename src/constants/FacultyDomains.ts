export const FACULTY_DOMAINS = {
    ANKARA_UNI_BILGISAYAR: {
        name: "Ankara Üniversitesi Bilgisayar Mühendisliği",
        website: "http://comp.eng.ankara.edu.tr/feed"
    },
    ANKARA_UNI_ORIGINAL:{
        name: "Ankara Üniversitesi Original",
        website: "https://www.ankara.edu.tr/feed"
    },
    ANKARA_UNI_OGR_DEKANLIK:{
        name: "Ankara Üniversitesi Öğrenci Dekanlığı",
        website: "http://ogrencidekanligi.ankara.edu.tr/feed"
    },
    ANKARA_UNI_OIDB:{
        name: "Ankara Üniversitesi Öğrenci İşleri Daire Başkanlığı",
        website: "http://oidb.ankara.edu.tr/feed"
    },
    ANKARA_UNI_SKS:{
        name: "Ankara Üniversitesi Sağlık Spor Ve Daire Başkanlığı",
        website: "http://sks.ankara.edu.tr/feed"
    }
}

export const facultyNameList = Object.values(FACULTY_DOMAINS).map(_ => _.name)