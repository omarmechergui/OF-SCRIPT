'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProjectsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getProjects(1),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 h-48 border-gray-800 bg-gray-900/50">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="p-6 rounded-md border border-red-500/20 bg-red-500/10 text-red-500">
          <h3 className="font-semibold mb-2">Failed to load projects</h3>
          <p className="text-sm opacity-80">{error?.message || 'Unknown error occurred.'}</p>
        </div>
      </div>
    );
  }

  const { projects = [], progress: progressMap = {} } = data?.data || {};

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
        <p className="text-gray-400">Apply your knowledge with real-world scenarios.</p>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center text-gray-500 border-gray-800 bg-gray-900/50">
          <p>No projects available right now.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const userProgress = progressMap[project.id];
            
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-6 h-full flex flex-col hover:border-red-500/50 transition-colors group cursor-pointer border-gray-800 bg-gray-900/50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg group-hover:text-red-400 transition-colors">{project.title}</h3>
                    {userProgress && (
                      <Badge variant={userProgress.status === 'COMPLETED' ? 'default' : 'outline'}>
                        {userProgress.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-800">
                    <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">
                      Difficulty {project.difficulty}
                    </Badge>
                    {project.technologies?.slice(0, 2).map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs text-gray-500 border-gray-700">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies?.length > 2 && (
                      <Badge variant="outline" className="text-xs text-gray-500 border-gray-700">
                        +{project.technologies.length - 2}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
