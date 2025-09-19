
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileActivityStats: React.FC = () => (
  <Card className="mt-6 dark-glass-card">
    <CardHeader className="bg-black/60 border-b border-white/10">
      <CardTitle className="text-silver">Account Activity</CardTitle>
      <CardDescription className="text-silver/80">Your activity summary on CivicWatch</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-silver mb-1">-</div>
          <div className="text-sm text-silver/80">Reports Filed</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-silver mb-1">-</div>
          <div className="text-sm text-silver/80">Reports Resolved</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ProfileActivityStats;

