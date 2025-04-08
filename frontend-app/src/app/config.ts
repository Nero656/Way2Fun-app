export const base_url = 'http://192.168.1.90:81/api/'
//адрес для вывода изображений
export const image_url = 'http://192.168.1.90:81/'

// Для вывода N количества столбцов, в зависимости от устройства
export enum resolutionColumns {
    desktop = 4,
    tablet = 2,
    mobile = 1,
    fourK = 8
}
//Расчет разрешения экрана для вывода элементов
export const handleResize = () : resolutionColumns => {
    return  window.innerWidth <= 720 ? resolutionColumns.mobile :
        window.innerWidth <= 1100 ? resolutionColumns.tablet :
            window.innerWidth <= 2000 ? resolutionColumns.desktop :
                resolutionColumns.fourK
}


export const handleResizeMin = (minResolution : number) : boolean => {
    return  window.innerWidth < minResolution
}

//обработка нажатий с мышки
export const mouseEvent = (event: any, router: any, link: string) => {
    if (event.button === 0) {
        router.push(link);
    } else if (event.button === 1) {
        window.open(link, '_blank');
    }
}

//проверка авторизации
export const authorizationFetch = (token: string) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}