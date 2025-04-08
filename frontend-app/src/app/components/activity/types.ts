export interface activityType {
    activity: {
        id: number,
        name: string,
        description: string,
        short_description: string,
        price: string,
        duration: number,
        capacity: number,
        created_at: string,
        updated_at: string,
        city: {
            id: number,
            name: string,
            country: string,
            climate: string
            address: {
                street: string,
                building: string,
            }
        },
        guide: {
            id: number,
            name: string,
            email: string,
            telephone: string,
        },
        activity_date: {
            id: number,
            activity_id: number,
            event_date: string
        }[],
        images: {
            img_url: string,
        }[],
    },


    reviews: {
        current_page: number,
        data :{
            rating: number,
            user_id: number,
            activity_id: number,
            comment: string,
            created_at: string,
            user: {
                name: string,
                email: string,
                telephone: string,
            }
        }[],
        links: {
            url: string,
            label: string,
            active: boolean,
        }[],
        first_page_url: string,
        from: number,
        next_page_url: string,
        path: string,
        per_page: number,
        prev_page_url: null,
        to: number,
        total: number

    },

    average_rating: number,
    count_review: number,
    count_activities_booking: number,
}

export type activityList = {
    current_page: number,
    data: {
        id: number,
        name: string,
        description: string,
        short_description: string,
        price: string,
        duration: number,
        capacity: number,
        city: {
            id: number,
            name: string,
            country: string,
            climate: string,
            address: {
                street: string,
                building: string,
            }
        },
        activity_date: {
            id: number,
            activity_id: number,
            event_date: string,
        }[],
        guide: {
            id: number,
            name: string,
            email: string,
            telephone: string,
        }
        images: {
            img_url: string,
        }[]
    }[],
    first_page_url: string,
    last_page_url: string,
    last_page: number,
    from: number,
    links: [
        {
            url: string,
            label: string,
            active: boolean,
        }
    ],
    next_page_url: number,
    path: string,
    per_page: number,
    to: number,
    total: number
}

export type activityItem = {
    id: number,
    name: string,
    description: string,
    short_description: string,
    price: string,
    duration: number,
    capacity: number,
    city: {
        id: number,
        name: string,
        country: string,
        climate: string,
    },
    activity_date: {
        id: number,
        activity_id: number,
        event_date: string,
    }[],
    guide: {
        id: number,
        name: string,
        email: string,
        telephone: string,
    }
    images: {
        img_url: string,
    }[]
}