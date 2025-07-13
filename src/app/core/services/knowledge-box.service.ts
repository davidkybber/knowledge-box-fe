import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { 
  KnowledgeBox, 
  CreateKnowledgeBoxRequest, 
  UpdateKnowledgeBoxRequest, 
  KnowledgeBoxResponse, 
  KnowledgeBoxListResponse,
  DeleteKnowledgeBoxResponse 
} from '../models/knowledge-box.models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBoxService {
  private readonly baseUrl = 'https://knowledge-box-api.lemonhill-9a1917eb.westeurope.azurecontainerapps.io';
  
  private knowledgeBoxesSubject = new BehaviorSubject<KnowledgeBox[]>([]);
  public knowledgeBoxes$ = this.knowledgeBoxesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  // Get all knowledge boxes for current user
  getKnowledgeBoxes(): Observable<KnowledgeBoxListResponse> {
    return this.http.get<KnowledgeBoxListResponse>(`${this.baseUrl}/knowledgeboxes`);
  }

  // Get a specific knowledge box by ID
  getKnowledgeBox(id: string): Observable<KnowledgeBoxResponse> {
    return this.http.get<KnowledgeBoxResponse>(`${this.baseUrl}/knowledgeboxes/${id}`);
  }

  // Create a new knowledge box
  createKnowledgeBox(request: CreateKnowledgeBoxRequest): Observable<KnowledgeBoxResponse> {
    return this.http.post<KnowledgeBoxResponse>(`${this.baseUrl}/knowledgeboxes`, request);
  }

  // Update an existing knowledge box
  updateKnowledgeBox(request: UpdateKnowledgeBoxRequest): Observable<KnowledgeBoxResponse> {
    return this.http.put<KnowledgeBoxResponse>(`${this.baseUrl}/knowledgeboxes/${request.id}`, request);
  }

  // Delete a knowledge box
  deleteKnowledgeBox(id: string): Observable<DeleteKnowledgeBoxResponse> {
    return this.http.delete<DeleteKnowledgeBoxResponse>(`${this.baseUrl}/knowledgeboxes/${id}`);
  }

  // Search knowledge boxes
  searchKnowledgeBoxes(query: string, tags?: string[]): Observable<KnowledgeBoxListResponse> {
    let params = new HttpParams().set('query', query);
    if (tags && tags.length > 0) {
      params = params.set('tags', tags.join(','));
    }
    return this.http.get<KnowledgeBoxListResponse>(`${this.baseUrl}/knowledgeboxes/search`, { params });
  }

  // Get public knowledge boxes
  getPublicKnowledgeBoxes(): Observable<KnowledgeBoxListResponse> {
    return this.http.get<KnowledgeBoxListResponse>(`${this.baseUrl}/knowledgeboxes/public`);
  }

  // Update local state
  updateLocalKnowledgeBoxes(knowledgeBoxes: KnowledgeBox[]): void {
    this.knowledgeBoxesSubject.next(knowledgeBoxes);
  }

  // Add a new knowledge box to local state
  addKnowledgeBoxToLocal(knowledgeBox: KnowledgeBox): void {
    const current = this.knowledgeBoxesSubject.value;
    this.knowledgeBoxesSubject.next([...current, knowledgeBox]);
  }

  // Update a knowledge box in local state
  updateKnowledgeBoxInLocal(updatedKnowledgeBox: KnowledgeBox): void {
    const current = this.knowledgeBoxesSubject.value;
    const index = current.findIndex(kb => kb.id === updatedKnowledgeBox.id);
    if (index !== -1) {
      current[index] = updatedKnowledgeBox;
      this.knowledgeBoxesSubject.next([...current]);
    }
  }

  // Remove a knowledge box from local state
  removeKnowledgeBoxFromLocal(id: string): void {
    const current = this.knowledgeBoxesSubject.value;
    const filtered = current.filter(kb => kb.id !== id);
    this.knowledgeBoxesSubject.next(filtered);
  }
}