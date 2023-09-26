import { z, defineCollection, reference } from 'astro:content';

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.object({
            url: z.string(),
            alt: z.string(),
        }).optional(),
        author: reference('authors'),
    })
});

const journeys = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.object({
            url: z.string(),
            alt: z.string(),
        }).optional(),
        slug: z.string(),
    })
});

const authors = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string(),
    })
});


export const collections = {blog, authors};