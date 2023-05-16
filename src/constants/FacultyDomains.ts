interface FacultyDomain {
    name: string;
    website: string;
}

export const FACULTY_DOMAINS: FacultyDomain[] = [
    {
        name: "Ankara Üniversitesi Bilgisayar Mühendisliği",
        website: "http://comp.eng.ankara.edu.tr/feed"
    },
    {
        name: "Ankara Üniversitesi Original",
        website: "https://www.ankara.edu.tr/feed"
    },
    {
        name: "Ankara Üniversitesi Öğrenci Dekanlığı",
        website: "http://ogrencidekanligi.ankara.edu.tr/feed"
    },
    {
        name: "Ankara Üniversitesi Öğrenci İşleri Daire Başkanlığı",
        website: "http://oidb.ankara.edu.tr/feed"
    },
    {
        name: "Ankara Üniversitesi Sağlık Spor Ve Daire Başkanlığı",
        website: "http://sks.ankara.edu.tr/feed"
    },
    {
        name: "Ankara Üniversitesi Öğrenci Dekanlığı",
        website: "http://ogrencidekanligi.ankara.edu.tr/feed"
    }
]

export const facultyNameList = FACULTY_DOMAINS.map( obj => obj.name );