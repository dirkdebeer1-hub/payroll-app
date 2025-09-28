Restore
                    </Button>
                    {showArchived && (
                      <Button
                        onClick={() => onDelete(company.id)}
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2 text-xs bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        data-testid={`button-delete-${company.id}`}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-first">
            First
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-previous">
            Previous
          </button>
        </div>
        
        <span className="text-sm text-gray-600">
          Page 1 of 1 ({companies.length} companies)
        </span>
        
        <div className="flex gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-next">
            Next
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors" data-testid="button-pagination-last">
            Last
          </button>
        </div>
      </div>
    </div>
  );
}