'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { getModuleResources } from '@/utils/api';
import { useParams } from 'next/navigation';

const ModuleDetails = () => {
    const [moduleContent, setModuleContent] = useState<{ title: string; contentUrl: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const params = useParams(); // Access route params dynamically
    const { courseId, moduleId } = useParams() as { courseId: string; moduleId: string };

    useEffect(() => {
        const fetchModuleContent = async () => {
            try {
                if (!courseId || !moduleId) {
                    setError('Invalid course or module ID.');
                    setLoading(false);
                    return;
                }

                console.log('Fetching content for:', { courseId, moduleId }); // Debugging log
                const data = await getModuleResources(courseId, moduleId);
                setModuleContent(data);
                setError(null); // Clear previous errors
            } catch (err) {
                console.error('Error fetching module content:', err);
                setError('Failed to fetch module content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchModuleContent();
    }, [courseId, moduleId]);

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading module content...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-red-500">{error}</p>
                </div>
            </Layout>
        );
    }

    if (!moduleContent) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-500">No module content found.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">{moduleContent.title}</h1>
                <p>
                    Content URL:{' '}
                    <a href={moduleContent.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {moduleContent.contentUrl}
                    </a>
                </p>
            </div>
        </Layout>
    );
};

export default ModuleDetails;